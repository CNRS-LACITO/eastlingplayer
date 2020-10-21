<?php 

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$oaiID = isset($_GET['oai_primary']) ? $_GET['oai_primary'] : NULL;
// ID du document

$oaiPrimary = isset($_GET['oai_primary']) ? $_GET['oai_primary'] : NULL;
$oaiSecondary = isset($_GET['oai_secondary']) ? $_GET['oai_secondary'] : NULL;

// ID du document
// ID du fichier annotations

if($oaiPrimary == NULL && $oaiSecondary == NULL) die("You must provide an OAI ID.");

$oaiID = ($oaiPrimary != NULL) ? $oaiPrimary : $oaiSecondary;

//$xmlMetadata = simplexml_load_file('HT://cocoon.huma-num.fr/crdo_servlet/oai-pmh?verb=GetRecord&metadataPrefix=crdo_dcq&identifier=oai:crdo.vjf.cnrs.fr:'.$oaiID);
//$ns = $xmlMetadata->getNamespaces(true);

//$xml = dom_import_simplexml($xmlMetadata);
//$isRequiredByList= $xml->getElementsByTagNameNS($ns['dcterms'],'isRequiredBy'); 
//$metadataIdentifierList= $xml->getElementsByTagNameNS($ns['dc'],'identifier'); 
//$mediaFormat= $xml->getElementsByTagNameNS($ns['dc'],'format')[0]->textContent;

function recursiveParseXML($xmlTag,$o){
//fonction pour convertir le XML en JSON

	if($xmlTag->nodeName!='#text'){

		if(isset($o->{$xmlTag->nodeName})){

			if(gettype($o->{$xmlTag->nodeName}) == 'object'){
				$v = $o->{$xmlTag->nodeName};
				$o->{$xmlTag->nodeName}=array();
				$o->{$xmlTag->nodeName}[]=$v;
			}

			$obj = new stdClass();

			if(sizeof($xmlTag->attributes)>0){
				foreach($xmlTag->attributes as $a){
					$obj->{$a->nodeName}=$a->nodeValue;
				}	
			}
			if(sizeof($xmlTag->childNodes)>1){
				foreach($xmlTag->childNodes as $c){
					recursiveParseXML($c,$obj);
				}
			}else{
					$obj->text=$xmlTag->textContent;
			}
			$o->{$xmlTag->nodeName}[]=$obj;
		}else{
			$o->{$xmlTag->nodeName} = new stdClass();
			
			$attr = array();

			if(sizeof($xmlTag->attributes)>0){
				foreach($xmlTag->attributes as $a){
					$o->{$xmlTag->nodeName}->{$a->nodeName}=$a->nodeValue;
				}	
			}
			if(sizeof($xmlTag->childNodes)>1){
				foreach($xmlTag->childNodes as $c){
					if($c->nodeName!='#text')
					recursiveParseXML($c,$o->{$xmlTag->nodeName});
				}
			}else{
					$o->{$xmlTag->nodeName}->text=$xmlTag->textContent;
			}
		}
	}
}

function completeTranscriptionLang(&$nodeTranscription, &$langTranscriptions, $default){
//On met la propriété kindOf par défaut si elle n'est pas renseigné dans le document
//On enrichit la liste des types de transcriptions existant dans le document

	if(gettype($nodeTranscription)=="array"){
	//le noeud peut contenir plusieurs transcriptions...
		
		foreach ($nodeTranscription as $keyF => $transcription) {
		
			if(!property_exists($transcription, "kindOf")){
				$langTranscriptions[] = $default;
				$transcription->kindOf = $default;
			}else{
				$langTranscriptions[]=$transcription->kindOf;
			}

		}	
	}elseif(gettype($nodeTranscription)=="object"){
	//ou une seule
		if(!property_exists($nodeTranscription, "kindOf")){
				$langTranscriptions[] = $default;
				$nodeTranscription->kindOf = $default;

			}else{
				$langTranscriptions[]=$nodeTranscription->kindOf;
			}

	}

	$langTranscriptions = array_unique($langTranscriptions);
	
}

function completeTranslationLang(&$nodeTranslation, &$langTranslations){
//On enrichit la liste des types de traduction existant dans le document

	if(gettype($nodeTranslation)=="array"){
	//le noeud peut contenir plusieurs traductions...

		foreach ($nodeTranslation as $transl) {
			if(property_exists($transl, "xml:lang")){
				$langTranslations[]=$transl->{"xml:lang"};
			}	
		}
	}elseif(gettype($nodeTranslation)=="object"){
	//ou une seule
		if(property_exists($nodeTranslation, "xml:lang")){
				$langTranslations[]=$nodeTranslation->{"xml:lang"};
		}

	}

	$langTranslations = array_unique($langTranslations);
}


$resourcesUrl = array();
$annotationsUrl = array();
$imagesUrl = array();
$doi="";

$servername = "mysql80a.db.huma-num.fr";
$dbname ="pangloss";
$user="pangloss";
$pass="R3i3wddi_qyBlsD9Y";

try{
        $options = array(
                         PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
                        PDO::MYSQL_ATTR_SSL_CA => '',
                        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
                );
        $db = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $user, $pass, $options);
        $db->exec("SET CHARACTER SET utf8");

        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////

        if($oaiPrimary != NULL){
        //Traitement de la ressource primaire

        	$sql = "SELECT * FROM primary_resources WHERE oai =\"$oaiPrimary\"";
		
			//On parse la table primary_resources pour récupérer le document principal avec le son ou la vidéo
			foreach  ($db->query($sql) as $row) {

			    //fichier audio .MP3 ou vidéo .MP4
			    $sMedia = $row['url_compressed_file'];
			    $asMedia = explode(".",$sMedia);
			    $ext = strtolower($asMedia[sizeof($asMedia)-1]);
			    switch ($ext) {
				    case "mp3":
				        $audioUrl=$sMedia;
				        break;
				    case "mp4":
				        $videoUrl=$sMedia;
				        break;
				}

			    //fichiers : annotations et image (optionnel)
			    $oResources =  json_decode($row['related_resources']);
			    $aResources = $oResources->secondary;

			    //on parse la table secondary_resources pour récupérer les fichiers annotations et image
			    foreach($aResources as $oResource){
			    	$oaiIds = explode(":", $oResource);
			    	$sql = "SELECT * FROM secondary_resources WHERE oai =\"$oaiIds[2]\"";

			    	foreach  ($db->query($sql) as $row2) {
			    		$sUrlFile = $row2['url_pangloss_file'];
			    		$asUrlFile = explode(".", $sUrlFile);

			    		switch ( strtolower($asUrlFile[sizeof($asUrlFile)-1]) ) {
						    case "xml":
						        //$audioUrl=$sMedia;
						        break;
						    case "jpg":
						        $imagesUrl[] = array("id"=>$row2['oai'],"url"=>$row2['url_pangloss_file']);
						        break;
						}//switch
			    	}//for
			    }//for		 
			}//for		
		
			$response = array(
				'oai_type'=>'primary',
				'metadata'=>$metadataJson,
				'audio'=>$audioUrl,
				'video'=>$videoUrl,
				'images'=>$imagesUrl
			);

		}elseif($oaiSecondary != NULL){
		//Traitement de la ressource secondaire

			$sql = "SELECT * FROM secondary_resources WHERE oai =\"$oaiSecondary\"";

			//On parse la table secondary_resources pour récupérer le fichier annotation
			foreach  ($db->query($sql) as $row) {
				$sUrlFile = $row['url_pangloss_file'];
				$doi = $row['doi'];

				$xmlData = simplexml_load_file($sUrlFile);
				$annotationXml = dom_import_simplexml($xmlData);
				$annotationJson = new stdClass();
				recursiveParseXML($annotationXml,$annotationJson);

				$langTranscriptions = [];
				$langTranslations = [];
				$langGlosses = [];
				$langWholeTranslations = [];

				//27/08/2020 : get the different languages available
				//28/08/2020 : set a default language for transcription
				
				if(property_exists($annotationJson->TEXT,"TRANSL")){
					foreach ($annotationJson->TEXT->TRANSL as $wholeTranslation){
						$langWholeTranslations[]=$wholeTranslation->{"xml:lang"};
						$langWholeTranslations = array_unique($langWholeTranslations);
					}
				}

				foreach ($annotationJson->TEXT->S as $keyS => &$sentence) {

					completeTranscriptionLang($sentence->FORM,$langTranscriptions,"phone");
					completeTranslationLang($sentence->TRANSL,$langTranslations);
				
					if(property_exists($sentence, "W")){

						if(gettype($sentence->W)=="object"){
							completeTranscriptionLang($sentence->W->FORM,$langTranscriptions,"phone");
							completeTranslationLang($sentence->W->TRANSL,$langGlosses);
							//Morphème
							if(property_exists($sentence->W, "M")){
								if(gettype($sentence->W->M)=="object"){
								//un seul morphème...
									completeTranscriptionLang($sentence->W->M->FORM,$langTranscriptions,"phone");
									completeTranslationLang($sentence->W->M->TRANSL,$langGlosses);
								}elseif(gettype($sentence->W->M)=="array"){
								//ou plusieurs morphèmes
									foreach ($sentence->W->M as $keyM => &$morph) {
										completeTranscriptionLang($morph->FORM,$langTranscriptions,"phone");
										completeTranslationLang($morph->TRANSL,$langGlosses);
									}
								}
							}

						}elseif(gettype($sentence->W)=="array"){
							foreach ($sentence->W as $keyW => &$word) {
								completeTranscriptionLang($word->FORM,$langTranscriptions,"phone");
								completeTranslationLang($word->TRANSL,$langGlosses);

								//Morphème
								if(property_exists($word, "M")){
									if(gettype($word->M)=="object"){
									//un seul morphème...
										completeTranscriptionLang($word->M->FORM,$langTranscriptions,"phone");
										completeTranslationLang($word->M->TRANSL,$langGlosses);
									}elseif(gettype($word->M)=="array"){
									//ou plusieurs morphèmes
										foreach ($word->M as $keyM => &$morph) {
											completeTranscriptionLang($morph->FORM,$langTranscriptions,"phone");
											completeTranslationLang($morph->TRANSL,$langGlosses);
										}
									}
								}

							}
						}

					}
		
				}

				$response = array(
					'oai_type'=>'secondary',
					'doi'=>$doi,
					'annotations'=>$annotationJson,
					'langues'=>array(
						'transcriptions'=>$langTranscriptions,
						'translations'=>$langTranslations,
						'glosses'=>$langGlosses,
						'wholeTranslations'=>$langWholeTranslations
					)
				);
			}

			
		}//if secondary

}
catch(Exception $e){
        die ('Erreur:'.$e->getMessage());
}

echo json_encode($response);

?>