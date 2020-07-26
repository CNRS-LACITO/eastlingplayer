<?php 

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$xmlMetadata = simplexml_load_file('https://cocoon.huma-num.fr/crdo_servlet/oai-pmh?verb=GetRecord&metadataPrefix=crdo_dcq&identifier=oai:crdo.vjf.cnrs.fr:'.$_GET['idDoc']);
$ns = $xmlMetadata->getNamespaces(true);

$xml = dom_import_simplexml($xmlMetadata);
$isRequiredByList= $xml->getElementsByTagNameNS($ns['dcterms'],'isRequiredBy'); 
$metadataIdentifierList= $xml->getElementsByTagNameNS($ns['dc'],'identifier'); 
$mediaFormat= $xml->getElementsByTagNameNS($ns['dc'],'format')[0]->textContent;

$resourcesUrl = array();
$annotationsUrl = array();
$imagesUrl = array();

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

			if($format=="text/xml"){
				$annotationsUrl[] = array("id"=>$urlParts[sizeof($urlParts)-1],"url"=>$content);
			}else if($format=="image/jpeg"){
				
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

$annotations = [];

foreach($annotationsUrl as $aUrl){
	$annotationXml = dom_import_simplexml(simplexml_load_file($aUrl['url']));
	$annotationJson = new stdClass();
	recursiveParseXML($annotationXml,$annotationJson);

	$annotations[] = array(
		'id'=>$aUrl['id'],
		'data'=>$annotationJson
	);

}

$response = array(
	'metadata'=>$metadataJson,
	'annotations'=>$annotations,
	'audio'=>$audioUrl,
	'video'=>$videoUrl,
	'images'=>$imagesUrl
);

echo json_encode($response);

?>
