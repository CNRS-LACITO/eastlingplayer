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

// type de transcription par défaut quand absente
$defaultKindOf = "other";


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
				$transcription->kindOf=str_replace(" ", "-", $transcription->kindOf);
				$langTranscriptions[]=str_replace(" ", "-", $transcription->kindOf);
			}

		}	
	}elseif(gettype($nodeTranscription)=="object"){
	//ou une seule
		if(!property_exists($nodeTranscription, "kindOf")){
				$langTranscriptions[] = $default;
				$nodeTranscription->kindOf = $default;

			}else{
				$nodeTranscription->kindOf = str_replace(" ", "-",$nodeTranscription->kindOf);
				$langTranscriptions[] = str_replace(" ", "-",$nodeTranscription->kindOf);
			}

	}

	$langTranscriptions = array_unique($langTranscriptions);
	
}

function completeTranslationLang(&$nodeTranslation, &$langTranslations,$default){
//On enrichit la liste des types de traduction existant dans le document

	if(gettype($nodeTranslation)=="array"){
	//le noeud peut contenir plusieurs traductions...

		foreach ($nodeTranslation as $transl) {
			if(property_exists($transl, "xml:lang")){
				$langTranslations[]=$transl->{"xml:lang"};
			}else{
				$langTranslations[]=$default;
				$transl->{"xml:lang"} = $default;
			}	
		}
	}elseif(gettype($nodeTranslation)=="object"){
	//ou une seule
		if(property_exists($nodeTranslation, "xml:lang")){
				$langTranslations[]=$nodeTranslation->{"xml:lang"};
		}else{
			$langTranslations[]=$default;
			$nodeTranslation->{"xml:lang"} = $default;
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

			//On parse la table secondary_resources pour récupérer le fichier annotation
				$sUrlFile = 'https://eastling.huma-num.fr/player/test.xml';
				
				$doi = $row['doi'];

				$xmlData = simplexml_load_file($sUrlFile);
				$annotationXml = dom_import_simplexml($xmlData);
				$annotationJson = new stdClass();
				recursiveParseXML($annotationXml,$annotationJson);

				$langTranscriptions = [];
				$langTranslations = [];
				$langGlosses = [];
				$langNotes = [];
				$langWholeTranslations = [];

				//27/08/2020 : get the different languages available
				//28/08/2020 : set a default language for transcription

				$hasWholeTranscription = true;
				$hasWholeTranslation = true;

				//github #8 : whole transcription
				if(!isset($annotationJson->TEXT->FORM)){
					//si pas de whole transcription du texte
					$hasWholeTranscription = false;
					
				}
				//

				//github #18 : whole translation
				if(!isset($annotationJson->TEXT->TRANSL)){
					//si pas de whole transcription du texte
					$hasWholeTranslation = false;
					
				}
				//

				foreach ($annotationJson->TEXT->S as $keyS => &$sentence) {

					completeTranscriptionLang($sentence->FORM,$langTranscriptions,$defaultKindOf);
					completeTranslationLang($sentence->TRANSL,$langTranslations,$defaultKindOf);
					completeTranslationLang($sentence->NOTE,$langNotes,$defaultKindOf);


					//github #8 : whole transcription
					if(!$hasWholeTranscription && isset($sentence->FORM)){

						if(gettype($sentence->FORM)=="object"){
							$wholeTranscription[$sentence->FORM->kindOf] .= $sentence->FORM->text."\n";
						}elseif(gettype($sentence->FORM)=="array"){

							foreach ($sentence->FORM as $transcription) {
								$wholeTranscription[$transcription->kindOf] .= $transcription->text."\n";
							}
						}	
					}
					//

					//github #18 : whole translation
					if(!$hasWholeTranslation && isset($sentence->TRANSL)){

						if(gettype($sentence->TRANSL)=="object"){
							$wholeTranslation[$sentence->TRANSL->{"xml:lang"}] .= $sentence->TRANSL->text."\n";
						}elseif(gettype($sentence->TRANSL)=="array"){

							foreach ($sentence->TRANSL as $transcription) {
								$wholeTranslation[$transcription->{"xml:lang"}] .= $transcription->text."\n";
							}
						}	
					}
					//
				
					if(property_exists($sentence, "W")){

						if(gettype($sentence->W)=="object"){
							completeTranscriptionLang($sentence->W->FORM,$langTranscriptions,$defaultKindOf);
							completeTranslationLang($sentence->W->TRANSL,$langGlosses,$defaultKindOf);
							completeTranslationLang($sentence->W->NOTE,$langNotes,$defaultKindOf);
							//Morphème
							if(property_exists($sentence->W, "M")){
								if(gettype($sentence->W->M)=="object"){
								//un seul morphème...
									completeTranscriptionLang($sentence->W->M->FORM,$langTranscriptions,$defaultKindOf);
									completeTranslationLang($sentence->W->M->TRANSL,$langGlosses,$defaultKindOf);
									completeTranslationLang($sentence->W->M->NOTE,$langNotes,$defaultKindOf);
								}elseif(gettype($sentence->W->M)=="array"){
								//ou plusieurs morphèmes
									foreach ($sentence->W->M as $keyM => &$morph) {
										completeTranscriptionLang($morph->FORM,$langTranscriptions,$defaultKindOf);
										completeTranslationLang($morph->TRANSL,$langGlosses,$defaultKindOf);
										completeTranslationLang($morph->NOTE,$langNotes,$defaultKindOf);
									}
								}
							}

						}elseif(gettype($sentence->W)=="array"){
							foreach ($sentence->W as $keyW => &$word) {
								completeTranscriptionLang($word->FORM,$langTranscriptions,$defaultKindOf);
								completeTranslationLang($word->TRANSL,$langGlosses,$defaultKindOf);
								completeTranslationLang($word->NOTE,$langNotes,$defaultKindOf);

								//Morphème
								if(property_exists($word, "M")){
									if(gettype($word->M)=="object"){
									//un seul morphème...
										completeTranscriptionLang($word->M->FORM,$langTranscriptions,$defaultKindOf);
										completeTranslationLang($word->M->TRANSL,$langGlosses,$defaultKindOf);
										completeTranslationLang($word->M->NOTE,$langNotes,$defaultKindOf);
									}elseif(gettype($word->M)=="array"){
									//ou plusieurs morphèmes
										foreach ($word->M as $keyM => &$morph) {
											completeTranscriptionLang($morph->FORM,$langTranscriptions,$defaultKindOf);
											completeTranslationLang($morph->TRANSL,$langGlosses,$defaultKindOf);
											completeTranslationLang($morph->NOTE,$langNotes,$defaultKindOf);
										}
									}
								}

							}
						}

					}
		
				}

				///////////////////////////////////////////////////////////////////
				// github #20
				foreach ($annotationJson->WORDLIST->W as $keyW => &$word) {

					completeTranscriptionLang($word->FORM,$langTranscriptions,$defaultKindOf);
					completeTranslationLang($word->TRANSL,$langGlosses,$defaultKindOf);
					completeTranslationLang($word->NOTE,$langNotes,$defaultKindOf);


					if(property_exists($word, "M")){

						if(gettype($word->M)=="object"){
							completeTranscriptionLang($word->M->FORM,$langTranscriptions,$defaultKindOf);
							completeTranslationLang($word->M->TRANSL,$langGlosses,$defaultKindOf);
							completeTranslationLang($word->M->NOTE,$langNotes,$defaultKindOf);


						}elseif(gettype($word->M)=="array"){
							foreach ($word->M as $keyM => &$morph) {
								completeTranscriptionLang($morph->FORM,$langTranscriptions,$defaultKindOf);
								completeTranslationLang($morph->TRANSL,$langGlosses,$defaultKindOf);
								completeTranslationLang($morph->NOTE,$langNotes,$defaultKindOf);

							}
						}

					}
		
				}

				//////////////////////////////////////////////////////////////////

				completeTranscriptionLang($annotationJson->TEXT->FORM,$langWholeTranscriptions,$langTranscriptions[0]);
				completeTranslationLang($annotationJson->TEXT->TRANSL,$langWholeTranslations,$defaultKindOf);
				completeTranslationLang($annotationJson->TEXT->NOTE,$langNotes,$defaultKindOf);

				//github #8 : whole transcription
				if(!$hasWholeTranscription){
					//$annotationJson->TEXT->FORM = $wholeTranscription;
					foreach ($wholeTranscription as $kindOf => $text) {
						$annotationJson->TEXT->FORM[] = array(
							"kindOf"=>$kindOf,
							"text"=>$text
						);
					}
				}
				//

				//github #18 : whole translation
				if(!$hasWholeTranslation){
					//$annotationJson->TEXT->FORM = $wholeTranscription;
					foreach ($wholeTranslation as $kindOf => $text) {
						$annotationJson->TEXT->TRANSL[] = array(
							"xml:lang"=>$kindOf,
							"text"=>$text
						);
					}

					$langWholeTranslations = $langTranslations;
				}
				//

				//bug d'indexation dans REACT si index pas dans l'ordre (array_unique peut supprimer des items intermédiaires)
				$langTranslations = array_values($langTranslations);
				$langTranscriptions = array_values($langTranscriptions);
				$langGlosses = array_values($langGlosses);
				$langNotes = array_values($langNotes);

				$response = array(
					'oai_type'=>'secondary',
					'doi'=>$doi,
					'annotations'=>$annotationJson,
					'langues'=>array(
						'transcriptions'=>$langTranscriptions,
						'translations'=>$langTranslations,
						'glosses'=>$langGlosses,
						'notes'=>$langNotes,
						'wholeTranslations'=>$langWholeTranslations
					)
				);
			

			
		}//if secondary

}
catch(Exception $e){
        die ('Erreur:'.$e->getMessage());
}

echo json_encode($response);

?>