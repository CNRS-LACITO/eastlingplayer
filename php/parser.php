<?php 

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$oaiID = $_GET['oai_primary']; // ID du document

$oaiPrimary = $_GET['oai_primary']; // ID du document
$oaiSecondary = $_GET['oai_secondary']; // ID du fichier annotations

if($oaiPrimary == NULL && $oaiSecondary == NULL) die("You must provide an OAI ID.");

$oaiID = ($oaiPrimary != NULL) ? $oaiPrimary : $oaiSecondary;

$xmlMetadata = simplexml_load_file('https://cocoon.huma-num.fr/crdo_servlet/oai-pmh?verb=GetRecord&metadataPrefix=crdo_dcq&identifier=oai:crdo.vjf.cnrs.fr:'.$oaiID);
$ns = $xmlMetadata->getNamespaces(true);

$xml = dom_import_simplexml($xmlMetadata);
$isRequiredByList= $xml->getElementsByTagNameNS($ns['dcterms'],'isRequiredBy'); 
$metadataIdentifierList= $xml->getElementsByTagNameNS($ns['dc'],'identifier'); 
$mediaFormat= $xml->getElementsByTagNameNS($ns['dc'],'format')[0]->textContent;

$resourcesUrl = array();
$annotationsUrl = array();
$imagesUrl = array();

if($oaiPrimary != NULL){
	foreach($metadataIdentifierList as $metadataIdentifier){

		if(strpos($metadataIdentifier->textContent,'.mp3') || strpos($metadataIdentifier->textContent,'.wav')|| strpos($metadataIdentifier->textContent,'.ogg')){
		//if(strpos($mediaFormat,'audio') && strpos($metadataIdentifier->textContent,'.mp3')){
			$audioUrl = $metadataIdentifier->textContent;
		}

		if(strpos($metadataIdentifier->textContent,'.mp4') || strpos($metadataIdentifier->textContent,'.mov') || strpos($metadataIdentifier->textContent,'.avi')){
		//if(strpos($mediaFormat,'video') && strpos($metadataIdentifier->textContent,'.mp4')){
			$videoUrl = $metadataIdentifier->textContent;
		}
	}	
}


if($oaiSecondary!=NULL && $mediaFormat == "text/xml"){
	foreach($metadataIdentifierList as $identifier){
		if(strpos($identifier->textContent,'/data/')){
			$annotationUrl = $identifier->textContent;
		}		
	}

}

foreach($isRequiredByList as $isRequiredBy){
	$resourceIdParts = explode('/',$isRequiredBy->textContent);
	$resourceId = $resourceIdParts[sizeof($resourceIdParts)-1];

	$xmlResourceMetadata = simplexml_load_file("https://cocoon.huma-num.fr/crdo_servlet/oai-pmh?verb=GetRecord&metadataPrefix=crdo_dcq&identifier=oai:crdo.vjf.cnrs.fr:".$resourceId);
	
	$xmlResourceMetadataXml = dom_import_simplexml($xmlResourceMetadata);

	$identifierList= $xmlResourceMetadataXml->getElementsByTagNameNS($ns['dc'],'identifier');
	$format= $xmlResourceMetadataXml->getElementsByTagNameNS($ns['dc'],'format')[0]->textContent;


	foreach($identifierList as $identifier){
		if(strpos($identifier->textContent,'/data/')){
			$content = $identifier->textContent;
			//si il s'agit d'un fichier annotation, on récupère les données

			$resourcesUrl[$format][] = $content;
			$urlParts = explode("/",$content);

			//if($format=="text/xml"){
				//$annotationsUrl[] = array("id"=>$urlParts[sizeof($urlParts)-1],"url"=>$content);	
			//}else 
			if($format=="image/jpeg"){
				
				$imagesUrl[] = array("id"=>$urlParts[sizeof($urlParts)-1],"url"=>$content);
			}

		}		
	}

}

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


$metadataJson = new stdClass();
recursiveParseXML($xml,$metadataJson);



if($oaiPrimary != NULL){
	$response = array(
		'oai_type'=>'primary',
		'metadata'=>$metadataJson,
		'audio'=>$audioUrl,
		'video'=>$videoUrl,
		'images'=>$imagesUrl
	);	
}else{

	//$annotations = [];
	$langTranscriptions = [];
	$langTranslations = [];

	$annotationXml = dom_import_simplexml(simplexml_load_file($annotationUrl));
	$annotationJson = new stdClass();
	recursiveParseXML($annotationXml,$annotationJson);
	foreach ($annotationJson->TEXT->S as $sentence) {
		foreach ($sentence->FORM as $transcription) {
			$langTranscriptions[]=$transcription->kindOf;
			$langTranscriptions = array_unique($langTranscriptions);
		}

		foreach ($sentence->TRANSL as $transl) {
			$langTranslations[]=$transl->{"xml:lang"};
			$langTranslations = array_unique($langTranslations);
		}
	}



	$response = array(
		'oai_type'=>'secondary',
		'annotations'=>$annotationJson,
		'langues'=>array(
			'transcriptions'=>$langTranscriptions,
			'translations'=>$langTranslations
		)
	);
}


echo json_encode($response);

?>
