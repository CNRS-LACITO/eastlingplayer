<?php 

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/x-latex');


$oaiID = isset($_GET['oai_primary']) ? $_GET['oai_primary'] : NULL;
// ID du document

$oaiSecondary = isset($_GET['oai_secondary']) ? $_GET['oai_secondary'] : NULL;

$lang = isset($_GET['lang']) ? $_GET['lang'] : 'fr';


header('Content-Disposition: attachment; filename="'.$oaiSecondary.'.tex"');
// ID du document
// ID du fichier annotations

if($oaiSecondary == NULL) die("You must provide an OAI ID.");

$oaiID = $oaiSecondary;


function hasChild($parentTag,$childTagName){
	$find=false;
	if(sizeof($parentTag->childNodes)>1){
		foreach($parentTag->childNodes as $c){
			if($c->nodeName===$childTagName)
			$find=true;
		}
	}
	return $find;
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
			if(sizeof($xmlTag->childNodes)>1 && !hasChild($xmlTag,'FOREIGN')){
				foreach($xmlTag->childNodes as $c){
					if($c->nodeName!='#text' && $c->nodeName!='FOREIGN')
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

			if((gettype($transcription)==="object" && !property_exists($transcription, "kindOf")) || (gettype($transcription)==="array" && array_key_exists('kindOf', $transcription))){
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

	//$langTranscriptions = array_unique($langTranscriptions);
	$langTranscriptions = array_values(array_unique($langTranscriptions));

}

function completeTranslationLang(&$nodeTranslation, &$langTranslations,$default){
//On enrichit la liste des types de traduction existant dans le document

	if(gettype($nodeTranslation)=="array"){
	//le noeud peut contenir plusieurs traductions...

		foreach ($nodeTranslation as $transl) {
			if((gettype($transl)==="object" && property_exists($transl, "xml:lang")) || (gettype($transl)==="array" && array_key_exists("xml:lang",$transl)) ){
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

	//$langTranslations = array_unique($langTranslations);
	$langTranslations = array_values(array_unique($langTranslations));

}

function concatenateAnnotation(&$nodeParent,$nodeChild,&$typeOf,$separator = "-"){
//On concatène les annotations (transc, transl) du niveau inférieur si pas disponibles
	$transcConcat = array();
	$translConcat = array();

	$hasTransc = true;
	$hasTransl = true;

	$hasTranscTypeOf = array();
	$hasTranslTypeOf = array();

	//Si aucune transcription n'existe
	if(!isset($nodeParent->FORM) || $nodeParent->FORM === null || sizeof($nodeParent->FORM)===0){
		$hasTransc = false;
		$nodeParent->FORM = array();

	}else{
		//Si il y a déjà des transcriptions, on récupère les typeOf pour voir lesquelles sont disponibles
		if(gettype($nodeParent->FORM)=="array"){
			foreach ($nodeParent->FORM as $c) {
				$hasTranscTypeOf[] = (strlen($c->kindOf)>0)?$c->kindOf:$defaultKindOf;
			}
		}elseif(gettype($nodeParent->FORM)=="object"){
				$hasTranscTypeOf[] = (strlen($nodeParent->FORM->kindOf)>0)?$nodeParent->FORM->kindOf:$defaultKindOf;
		}
		
	}

	//Si aucune tradution n'existe
	if(!isset($nodeParent->TRANSL) || $nodeParent->TRANSL === null || sizeof($nodeParent->TRANSL)===0){
		$hasTransl = false;
		$nodeParent->TRANSL = array();
	}else{
		//Si il y a déjà des traductions, on récupère les langues pour voir lesquelles sont disponibles
		if(gettype($nodeParent->TRANSL)=="array"){
			foreach ($nodeParent->TRANSL as $c) {
				$hasTranslTypeOf[] = $c->{"xml:lang"};
			}
		}elseif(gettype($nodeParent->TRANSL)=="object"){
				$hasTranslTypeOf[] = $nodeParent->TRANSL->{"xml:lang"};
		}
	}

	if(property_exists($nodeParent, $nodeChild)){
		if(gettype($nodeParent->$nodeChild)==="object"){

			if(isset($nodeParent->$nodeChild->FORM)){

				if(gettype($nodeParent->$nodeChild->FORM)=="object"){
					$kindOfForm = (strlen($nodeParent->$nodeChild->FORM->kindOf)>0)?$nodeParent->$nodeChild->FORM->kindOf:$defaultKindOf;
					$transcConcat[$kindOfForm] .= $nodeParent->$nodeChild->FORM->text.$separator;
				}elseif(gettype($nodeParent->$nodeChild->FORM)=="array"){

					foreach ($nodeParent->$nodeChild->FORM as $transcription) {
						if(gettype($transcription) === "object"){
							$kindOfForm = (strlen($transcription->kindOf)>0)?$transcription->kindOf:$defaultKindOf;
							$transcConcat[$kindOfForm] .= $transcription->text.$separator;
						}else{
							$kindOfForm = (strlen($transcription["kindOf"])>0)?$transcription-["kindOf"]:$defaultKindOf;
							$transcConcat[$kindOfForm] .= $transcription["text"].$separator;
						}
					}
				}	
			}
			//
			if(isset($nodeParent->$nodeChild->TRANSL)){

				if(gettype($nodeParent->$nodeChild->TRANSL)=="object"){
					$xmlLang = (strlen($nodeParent->$nodeChild->TRANSL->{"xml:lang"})>0)?$nodeParent->$nodeChild->TRANSL->{"xml:lang"}:$defaultKindOf;
					$translConcat[$xmlLang] .= $nodeParent->$nodeChild->TRANSL->text.$separator;
				}elseif(gettype($nodeParent->$nodeChild->TRANSL)=="array"){

					foreach ($nodeParent->$nodeChild->TRANSL as $translation) {
						if(gettype($translation) === "object"){
							$xmlLang = (strlen($translation->{"xml:lang"})>0)?$translation->{"xml:lang"}:$defaultKindOf;
							$translConcat[$xmlLang] .= $translation->text.$separator;
						}else{
							$xmlLang = (strlen($translation["xml:lang"])>0)?$translation["xml:lang"]:$defaultKindOf;
							$translConcat[$xmlLang] .= $translation["text"].$separator;
						}
					}
				}	
			}
		}elseif(gettype($nodeParent->$nodeChild)=="array"){
			foreach ($nodeParent->$nodeChild as $c) {

				if(isset($c->FORM)){
					//if only one FORM
					if(gettype($c->FORM)=="object"){
						$kindOfForm = (strlen($c->FORM->kindOf)>0)?$c->FORM->kindOf:$defaultKindOf;
						$transcConcat[$kindOfForm] .= $c->FORM->text.$separator;
					//if multiple FORM
					}elseif(gettype($c->FORM)=="array"){
						
						foreach ($c->FORM as $transcription) {
							
							if(gettype($transcription) === "object"){
								$kindOfForm = (strlen($transcription->kindOf)>0)?$transcription->kindOf:$defaultKindOf;
								$transcConcat[$kindOfForm] .= $transcription->text.$separator;
							}else{
								$kindOfForm = (strlen($transcription["kindOf"])>0)?$transcription["kindOf"]:$defaultKindOf;
								$transcConcat[$kindOfForm] .= $transcription["text"].$separator;
							}
						}
					}	
				}
				//
				if(isset($c->TRANSL)){

					if(gettype($c->TRANSL)=="object"){
						$xmlLang = (strlen($c->TRANSL->{"xml:lang"})>0)?$c->TRANSL->{"xml:lang"}:$defaultKindOf;
						$translConcat[$xmlLang] .= $c->TRANSL->text.$separator;
					}elseif(gettype($c->TRANSL)=="array"){

						foreach ($c->TRANSL as $translation) {
							if(gettype($translation) === "object"){
								$xmlLang = (strlen($translation->{"xml:lang"})>0)?$translation->{"xml:lang"}:$defaultKindOf;
								$translConcat[$xmlLang] .= $translation->text.$separator;
							}else{
								$xmlLang = (strlen($translation["xml:lang"])>0)?$translation["xml:lang"]:$defaultKindOf;
								$translConcat[$xmlLang] .= $translation["text"].$separator;
							}
							
						}
					}	
				}
			}
		}
	}

	switch ($nodeChild) {
		case 'S':
			$parent = "text";
			break;
		case 'W':
			$parent = "sentence";
			break;
		case 'M':
			$parent = "word";
			break;
		
		default:
			$parent = "text";
			break;
	}


	foreach($transcConcat as $kindOf => $text){
		if(!$hasTransc || !in_array($kindOf,$hasTranscTypeOf)){
			//#59 : "il ne faut pas proposer de niveau "transcription" : "autre" au niveau des phrases et du texte."
			if(! (($kindOf === $defaultKindOf) && ($parent === "sentence" || $parent === "text"))  ){
			//#59
				$typeOf[$parent]["transcriptions"][]=$kindOf;
				$typeOf[$parent]["transcriptions"] = array_values(array_unique($typeOf[$parent]["transcriptions"]));

				if(gettype($nodeParent->FORM)=="array"){
					$nodeParent->FORM[] = (object)array(
						"kindOf"=>$kindOf,"text"=>trim($text,$separator),"concat"=>'TRUE'
					);
				}elseif(gettype($nodeParent->FORM)=="object"){
					$nodeParent->FORM = (object)array(
						"kindOf"=>$kindOf,"text"=>trim($text,$separator),"concat"=>'TRUE'
					);
				}
			}

		}
	}

	foreach($translConcat as $xmlLang => $text){
		if(!$hasTransl || !in_array($xmlLang,$hasTranslTypeOf)){

			$typeOf[$parent]["translations"][]=$xmlLang;
			$typeOf[$parent]["translations"] = array_values(array_unique($typeOf[$parent]["translations"]));

			//#59 "on ne concatène jamais au niveau du mot pour la traduction de phrase"
			if($parent !== "sentence"){
			//#59
				if(gettype($nodeParent->TRANSL)=="array"){
					$nodeParent->TRANSL[] = (object)array(
						"xml:lang"=>$xmlLang,"text"=>trim($text,$separator),"concat"=>'TRUE'
					);
				}elseif(gettype($nodeParent->TRANSL)=="object"){
					$nodeParent->TRANSL = (object)array(
						"xml:lang"=>$xmlLang,"text"=>trim($text,$separator),"concat"=>'TRUE'
					);
				}
			}
			
		}
	}

}

function convertBlockToLatex($block,$type = "S"){
	$latex = "\begin{exe}";
	$latex.="\n";
	$latex .= "\\ex";
	$latex.="\n";

	if(gettype($block->FORM)==="array"){

		foreach ($block->FORM as $form) {
			$latex .= "\ipaex";
			$latex .= "{".$form->text."}\\\\";
			$latex.="\n";

			if(sizeof($block->W)>0){
				$latex .= "\gll ";
				
				foreach ($block->W as $word) {

					foreach($word->FORM as $wordForm){
						if($wordForm->kindOf === $form->kindOf){
							$latex.=$wordForm->text."\t";
						}
					}

					if(gettype($word->TRANSL)==="array"){
						foreach($word->TRANSL as $wordTransl){
							if($wordTransl->{"xml:lang"} === "fr")
								$transl.=$wordTransl->text."\t";
						}
					}else{
						if($word->TRANSL->{"xml:lang"} === "fr")
								$transl.=$word->TRANSL->text."\t";
					}
					
				}

				$latex .= "\\\\\n";
				$latex .= $transl;
				$latex .= "\\\\\n";
				
			}
			
		}
	}else{
			$form = $block->FORM;

			$latex .= "\ipaex";
			$latex .= "{".$form->text."}\\\\";
			$latex.="\n";

			if(sizeof($block->W)>0){
				$latex .= "\gll ";
				
				foreach ($block->W as $word) {

					foreach($word->FORM as $wordForm){
						if($wordForm->kindOf === $form->kindOf){
							$latex.=$wordForm->text."\t";
						}
					}

					if(gettype($word->TRANSL)==="array"){
						foreach($word->TRANSL as $wordTransl){
							if($wordTransl->{"xml:lang"} === "en")
								$transl.=$wordTransl->text."\t";
						}
					}else{
						if($word->TRANSL->{"xml:lang"} === "en")
								$transl.=$word->TRANSL->text."\t";
					}
					
				}

				$latex .= "\\\\\n";
				$latex .= $transl;
				$latex .= "\\\\\n";	
			}

	}

	
	if(gettype($block->TRANSL)==="array"){
		foreach ($block->TRANSL as $transl) {
			$latex .= "\glt ";
			if($transl->{"xml:lang"} === "en")
			$latex.=$transl->text."\\\\\n";
		}
	}else{
		$latex .= "\glt ";
		if($block->TRANSL->{"xml:lang"} === "en")
			$latex.=$block->TRANSL->text."\\\\\n";
	}

	$latex .= "\\end{exe}";
	$latex.="\n";

	return $latex;
}


$resourcesUrl = array();
$annotationsUrl = array();
$imagesUrl = array();
$doi="";

//
require('globalParameters.php');

try{
        $options = array(
                         PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
                        PDO::MYSQL_ATTR_SSL_CA => '',
                        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
                );
        $db = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $user, $pass, $options);
        $db->exec("SET CHARACTER SET utf8");

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
		if($oaiSecondary != NULL){
		//Traitement de la ressource secondaire


			$sql = "SELECT * FROM secondary_resources WHERE oai =\"$oaiSecondary\"";

			//On parse la table secondary_resources pour récupérer le fichier annotation
			foreach  ($db->query($sql) as $row) {
				$sUrlFile = str_replace("http:","https:",$row['url_pangloss_file']);
				$doi = $row['doi'];

				$xmlData = simplexml_load_file($sUrlFile);
				$annotationXml = dom_import_simplexml($xmlData);
				$annotationJson = new stdClass();
				recursiveParseXML($annotationXml,$annotationJson);

				$langNotes = [];

				//https://github.com/CNRS/eastlingplayer/issues/32
				$typeOf = array(
					'text'=>array(
						'transcriptions'=>array(),
						'translations'=>array()
					),
					'sentence'=>array(
						'transcriptions'=>array(),
						'translations'=>array()
					),
					'word'=>array(
						'transcriptions'=>array(),
						'translations'=>array()
					),
					'morpheme'=>array(
						'transcriptions'=>array(),
						'translations'=>array()
					)
				);


				//27/08/2020 : get the different languages available
				//28/08/2020 : set a default language for transcription

				$hasWholeTranscription = true;
				$hasWholeTranslation = true;

				
				//github #18 : whole translation
				if(isset($annotationJson->TEXT->FORM) && gettype($annotationJson->TEXT->FORM) ==="object"){
					//si pas de whole transcription du texte
					$firstObject = $annotationJson->TEXT->FORM;
					$annotationJson->TEXT->FORM = [];
					$annotationJson->TEXT->FORM[] = $firstObject;
					
				}

				//github #18 : whole translation

				if(!isset($annotationJson->TEXT->FORM) || $annotationJson->TEXT->FORM === null){
					//si pas de whole transcription du texte
					$annotationJson->TEXT->FORM = [];
				}

				//github #18 : whole translation

				if(isset($annotationJson->TEXT->TRANSL) && gettype($annotationJson->TEXT->TRANSL) ==="object"){
					//si pas de whole transcription du texte
					$firstObject = $annotationJson->TEXT->TRANSL;
					$annotationJson->TEXT->TRANSL = [];
					$annotationJson->TEXT->TRANSL[] = $firstObject;
					
				}

				//github #18 : whole translation
				if(!isset($annotationJson->TEXT->TRANSL) || $annotationJson->TEXT->TRANSL === null){
					//si pas de whole transcription du texte
					$annotationJson->TEXT->TRANSL = [];
				}

				//BUG
				$wID = 1;
				$mID = 1;

				foreach ($annotationJson->TEXT->S as $keyS => &$sentence) {
					//https://github.com/CNRS/eastlingplayer/issues/52
					$sentence->id = "S".($keyS + 1);

					//langues disponibles
					completeTranslationLang($sentence->NOTE,$langNotes,$defaultKindOf);
					completeTranscriptionLang($sentence->FORM,$typeOf["sentence"]["transcriptions"],$defaultKindOf);
					completeTranslationLang($sentence->TRANSL,$typeOf["sentence"]["translations"],$defaultKindOf);


					//github #8 : whole transcription
					if(isset($sentence->FORM)){
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
					if(isset($sentence->TRANSL)){

						if(gettype($sentence->TRANSL)=="object"){
							$wholeTranslation[$sentence->TRANSL->{"xml:lang"}] .= $sentence->TRANSL->text."\n";
						}elseif(gettype($sentence->TRANSL)=="array"){

							foreach ($sentence->TRANSL as $transcription) {
								$wholeTranslation[$transcription->{"xml:lang"}] .= $transcription->text."\n";
							}
						}	
					}


											
					if(property_exists($sentence, "W")){
						
						if(gettype($sentence->W)=="object"){

							$sentence->W->id = "W".$wID++;

							completeTranslationLang($sentence->W->NOTE,$langNotes,$defaultKindOf);

							completeTranscriptionLang($sentence->W->FORM,$typeOf["word"]["transcriptions"],$defaultKindOf);
							completeTranslationLang($sentence->W->TRANSL,$typeOf["word"]["translations"],$defaultKindOf);

							//Morphème
							if(property_exists($sentence->W, "M")){

								//concatenateAnnotation($sentence->W, "M",$typeOf);

								if(gettype($sentence->W->M)=="object"){
								//un seul morphème...
									$sentence->W->M->id = $mID++;
									completeTranslationLang($sentence->W->M->NOTE,$langNotes,$defaultKindOf);
									//#32
									completeTranscriptionLang($sentence->W->M->FORM,$typeOf["morpheme"]["transcriptions"],$defaultKindOf);
									completeTranslationLang($sentence->W->M->TRANSL,$typeOf["morpheme"]["translations"],$defaultKindOf);

								}elseif(gettype($sentence->W->M)=="array"){
								//ou plusieurs morphèmes
									foreach ($sentence->W->M as $keyM => &$morph) {
										//https://github.com/CNRS/eastlingplayer/issues/52
										$morph->id = "M".$mID++;
										completeTranslationLang($morph->NOTE,$langNotes,$defaultKindOf);
										//#32
										completeTranscriptionLang($morph->FORM,$typeOf["morpheme"]["transcriptions"],$defaultKindOf);
										completeTranslationLang($morph->TRANSL,$typeOf["morpheme"]["translations"],$defaultKindOf);

									}
								}
								concatenateAnnotation($sentence->W, "M",$typeOf);
							}


						}elseif(gettype($sentence->W)=="array"){
							foreach ($sentence->W as $keyW => &$word) {
								//https://github.com/CNRS/eastlingplayer/issues/52
								$word->id = "W".$wID++;
								completeTranslationLang($word->NOTE,$langNotes,$defaultKindOf);
								//32
								completeTranscriptionLang($word->FORM,$typeOf["word"]["transcriptions"],$defaultKindOf);
								completeTranslationLang($word->TRANSL,$typeOf["word"]["translations"],$defaultKindOf);


								//Morphème
								if(property_exists($word, "M")){
									
									//concatenateAnnotation($word, "M",$typeOf);

									if(gettype($word->M)=="object"){
									//un seul morphème...
										$word->M->id = $mID++;
										completeTranslationLang($word->M->NOTE,$langNotes,$defaultKindOf);
										//32
										completeTranscriptionLang($word->M->FORM,$typeOf["morpheme"]["transcriptions"],$defaultKindOf);
										completeTranslationLang($word->M->TRANSL,$typeOf["morpheme"]["translations"],$defaultKindOf);


									}elseif(gettype($word->M)=="array"){
									//ou plusieurs morphèmes
										foreach ($word->M as $keyM => &$morph) {
											//https://github.com/CNRS/eastlingplayer/issues/52
											$morph->id = "M".$mID++;
											completeTranslationLang($morph->NOTE,$langNotes,$defaultKindOf);

											//32
											completeTranscriptionLang($morph->FORM,$typeOf["morpheme"]["transcriptions"],$defaultKindOf);
											completeTranslationLang($morph->TRANSL,$typeOf["morpheme"]["translations"],$defaultKindOf);

										}
									}

									concatenateAnnotation($word, "M",$typeOf);
								}

							}
						}


						concatenateAnnotation($sentence, "W",$typeOf," ");


					}
		
				}

				///////////////////////////////////////////////////////////////////
				// github #20
				foreach ($annotationJson->WORDLIST->W as $keyW => &$word) {
					//https://github.com/CNRS/eastlingplayer/issues/52
					$word->id = "W".$wID++;

					completeTranslationLang($word->NOTE,$langNotes,$defaultKindOf);
					//32
					completeTranscriptionLang($word->FORM,$typeOf["word"]["transcriptions"],$defaultKindOf);
					completeTranslationLang($word->TRANSL,$typeOf["word"]["translations"],$defaultKindOf);


					if(property_exists($word, "M")){

						if(gettype($word->M)=="object"){

							completeTranslationLang($word->M->NOTE,$langNotes,$defaultKindOf);
							//32
							completeTranscriptionLang($word->M->FORM,$typeOf["morpheme"]["transcriptions"],$defaultKindOf);
							completeTranslationLang($word->M->TRANSL,$typeOf["morpheme"]["translations"],$defaultKindOf);


						}elseif(gettype($word->M)=="array"){
							foreach ($word->M as $keyM => &$morph) {
								//https://github.com/CNRS/eastlingplayer/issues/52
								$morph->id = "M".$mID++;
								completeTranslationLang($morph->NOTE,$langNotes,$defaultKindOf);
								//32
								completeTranscriptionLang($morph->FORM,$typeOf["morpheme"]["transcriptions"],$defaultKindOf);
								completeTranslationLang($morph->TRANSL,$typeOf["morpheme"]["translations"],$defaultKindOf);

							}
						}

					}
		
				}



				concatenateAnnotation($annotationJson->TEXT,"S",$typeOf,"\n");
				//////////////////////////////////////////////////////////////////

				completeTranscriptionLang($annotationJson->TEXT->FORM,$typeOf["text"]["transcriptions"],$defaultKindOf);
				completeTranslationLang($annotationJson->TEXT->TRANSL,$typeOf["text"]["translations"],$defaultKindOf);
				//completeTranslationLang($annotationJson->TEXT->NOTE,$langNotes,$defaultKindOf);

				$typeOf["note"]["translations"]=$langNotes;

				//bug d'indexation dans REACT si index pas dans l'ordre (array_unique peut supprimer des items intermédiaires)
				$langNotes = array_values($langNotes);

				$latex = "\documentclass{article}\n\usepackage{fontspec}\n\usepackage{gb4e}\n\\title{TestsPangloss}\n\author{Matthew DEO}\n\date{March 2021}\n\begin{document}\n";

				foreach ($annotationJson->TEXT->S as $sentence) {
					$latex.=convertBlockToLatex($sentence);
				}

				$latex.="\\end{document}";

				$response = array(
					'oai_type'=>'secondary',
					'urlFile'=>$sUrlFile,
					'extensionFile'=> pathinfo($sUrlFile, PATHINFO_EXTENSION),
					'doi'=>$doi,
					'annotations'=>$annotationJson,
					'langues'=>array(
						'notes'=>$langNotes,
					)
				);
			}

			
		}//if secondary

}
catch(Exception $e){
        die ('Erreur:'.$e->getMessage());
}

echo $latex;

?>