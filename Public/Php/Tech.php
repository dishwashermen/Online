<?php 

require_once 'Functions.php';

require_once 'DbSettings.php';

//$Hash = hash('sha256', md5($_GET['Login']) . 'mrs.Maysel');

//echo $Hash;

die();

$DB = new DBWORKER($dbu['host'], $dbu['db'], 'utf8', $dbu['user'], $dbu['pass']);;

$DBQ = new DBWORKER($dbu['host'], 'koksarea_hot' . $_GET['Project'], 'utf8', $dbu['user'], $dbu['pass']);

//$UID = $DB -> prep('SELECT `id` FROM `users` WHERE `prid` = 1 AND `StateIndex` > 42') -> fetchAll(PDO :: FETCH_ASSOC);

$max_qid = $DBQ -> prep('SELECT MAX(`id`) FROM `scheme_questions`') -> fetch(PDO :: FETCH_NUM)[0];

			$After = + $_GET['After'];

			$Col = isset($_GET['Col']) ? + $_GET['Col'] : 1;
		
			$Transit = $DBQ -> prep('SELECT `id`, `Transit`, `AltTransit` FROM `scheme_rules`') -> fetchAll(PDO :: FETCH_ASSOC);

			$NewTransit = array();

			$QueryString = '';

			$Change = false;

			foreach ($Transit as $TransitString) {
				
				foreach ($TransitString as $TRSK => $TRSV) {
					
					if ($TRSK == 'id') $Change = false;
					
					if ($TRSK != 'id') {
						
						if ($TRSV != '') {
						
							$TRSV_A = explode(',', $TRSV);
						
							$TRSV_B = array_map(function($x) {
								
								Global $After, $Col, $Change;
								
								if (is_numeric($x) && + $x > $After) {
									
									$Change = true;
									
									return $x + $Col;
									
								}
									
							}, $TRSV_A);
						
						}
						
						if ($Change) $TransitString[$TRSK] = $TRSV != '' ? implode(',', $TRSV_B) : NULL;
						
					}
					
				}
				
				if ($Change) array_push($NewTransit, $TransitString);
				
			}

			if (count($NewTransit)) {
				
				foreach ($NewTransit as $NTV) $QueryString .= '("' . implode('", "', $NTV) . '"),';
				
				$r = $DBQ -> prep('INSERT INTO `scheme_rules` (`id`, `Transit`, `AltTransit`) VALUES ' . substr(str_replace('""', 'NULL', $QueryString), 0, -1) . ' ON DUPLICATE KEY UPDATE Transit = VALUES(Transit), AltTransit = VALUES(AltTransit)');
				
			}
			
			for ($i = $max_qid; $i > $After; $i --) $DBQ -> prep('UPDATE `scheme_questions` SET `id` = ' . ($i + $Col) . ' WHERE `id` = ' . $i);

			for ($j = 1; $j <= $Col; $j ++) $DBQ -> prep('INSERT INTO `scheme_questions` (`id`) VALUES (' . ($After + $j) . ')');



echo '</br>Well done!';
	
?>