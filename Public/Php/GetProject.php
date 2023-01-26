<?php 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	
	require_once 'Functions.php';
	
	if (count($_POST) == 1 && ((isset($_POST['Hash']) && (strlen($_POST['Hash']) == 32 || strlen($_POST['Hash']) == 64)) || (isset($_POST['A']) && strlen($_POST['A']) <= 10))) {
		
		require_once 'DbSettings.php';

		$DB = new DBWORKER($dbu['host'], $dbu['db'], 'utf8', $dbu['user'], $dbu['pass']);
		
		if (isset($_POST['Hash'])) $Project = $DB -> prep('SELECT `projects`.* FROM `projects` WHERE `Hash` = :Hash AND `Mode` = "1" AND `Version` = "0"', array('Hash' => $_POST['Hash'])) -> fetch(PDO :: FETCH_ASSOC);
		
		else if (isset($_POST['A'])) $Project = $DB -> prep('SELECT `projects`.* FROM `projects` WHERE `Alias` IS NOT NULL AND `Alias` = :Alias AND `Mode` = "1" AND `Version` = "0"', array('Alias' => $_POST['A'])) -> fetch(PDO :: FETCH_ASSOC);
		
		if ($Project) {
			
			$DBQ = new DBWORKER($dbu['host'], 'koksarea_hot' . $Project['id'], 'utf8', $dbu['user'], $dbu['pass']);
			
			require_once 'Worker.php';
			
			$RulesData = $DBQ -> prep('SELECT `scheme_rules`.`Id`, `scheme_rules`.`StateIndex`, `scheme_rules`.`Event` FROM `scheme_rules` WHERE `Disabled` IS NULL AND `scheme_rules`.`Event` != ""') -> fetchAll(PDO :: FETCH_ASSOC);
			
			$Rules = [];
			
			if ($RulesData) foreach ($RulesData as $RV) if (! isset($Rules[$RV['Event']]) || ! in_array($RV['StateIndex'], $Rules[$RV['Event']])) $Rules[$RV['Event']][] = $RV['StateIndex'];
			
			$BaseData = $Project['AuthType'] == '1' ? GetbaseData($Project['AuthData']) : null;

			if ($Project['Limiting'] == '1') {
				
				$Limit = [];
				
				$LimitData = $DBQ -> prep('SELECT `scheme_limit`.`StateIndex` FROM `scheme_limit` GROUP BY `scheme_limit`.`StateIndex`') -> fetchAll(PDO :: FETCH_NUM);
				
				$LD = new RecursiveIteratorIterator(new RecursiveArrayIterator($LimitData));
				
				foreach($LD as $LDV) array_push($Limit, $LDV);
				
			} else $Limit = null;
			
			echo json_encode(array('Action' => 'Welcome', 'BaseData' => $BaseData, 'Project' => $Project, 'Rules' => (count($Rules) ? $Rules : false), 'Limit' => $Limit));
			
		} else echo json_encode(array('Action' => 'Reject')); 
		
	}
	
}

?>