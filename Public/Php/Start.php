<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    require_once 'Functions.php';
    
    if (count($_POST) >= 3 && preg_array_key_exists('/AuthData|AuthType|ProjectId/', $_POST)) {
		
		require_once 'DbSettings.php';
		
		require_once 'Worker.php';

		$DB = new DBWORKER($dbu['host'], $dbu['db'], 'utf8', $dbu['user'], $dbu['pass']);
		
		$DBQ = new DBWORKER($dbu['host'], 'koksarea_hot' . $_POST['ProjectId'], 'utf8', $dbu['user'], $dbu['pass']);

		$Ud = $DBQ -> prep('SELECT * FROM `scheme_users` WHERE `scheme_users`.`LoginData` = :LoginData', array('LoginData' => $_POST['AuthData'])) -> fetch(PDO :: FETCH_ASSOC);

		if ($Ud) { 
		
		// есть текущий пользователь --------------------------------------------------------------------------------------------
		
			$SendData = array('Q' => GetQ($Ud['StateIndex']), 'Action' => 'Resume', 'Ident' => 'Start', 'Uid' => $Ud['Id'], 'StateIndex' => $Ud['StateIndex'], 'SeparateIndex' => $Ud['SeparateIndex'], 'HistoryState' => $Ud['HistoryState'], 'Reload' => false, 'UserStatus' => $Ud['Status'], 'JournalIndex' => $Ud['JournalIndex']);
			
			if ($Ud['StateIndex']) $SendData['RuleData'] = RuleData($Ud['StateIndex'], $Ud['Id']);

			if ($Ud['LoginHash'] != null) {
				
				if (isset($_POST['AuthHash'])) {
				
					$Hash = hash('sha256', $_POST['AuthHash'] . 'mrs.Maysel');
					
					if ($Ud['LoginHash'] === $Hash) {
						
						logger('Login', $Ud['Id'], false);

						echo json_encode($SendData);
						
					} else $LoginStatus = false;
				
				} else $LoginStatus = false;
				
				if (isset($LoginStatus) && $LoginStatus === false) {
					
					logger('Denied', $Ud['Id']);
						
					echo json_encode(array('Action' => 'Denied'));
					
				}
				
			} else {
				
				logger('Login', $Ud['Id'], false);
				
				echo json_encode($SendData);

			}		
		
		} else {
			
		// нет текущего пользователя, создание нового ---------------------------------------------------------------------------

			$Uid = NewUser();
			
			if ($Uid != 'Limit') {
				
				if ($Uid != 'Denied') {
				
					logger('Create user', $Uid);
			
					echo json_encode(array('Q' => GetQ(1), 'Action' => 'Resume', 'Ident' => 'Start', 'Uid' => $Uid, 'StateIndex' => 1, 'SeparateIndex' => 1, 'JournalIndex' => 1, 'Reload' => false));
					
				} else echo json_encode(array('Action' => 'Denied'));

			} else echo json_encode(array('Action' => 'StartLimit'));

		}

	}
	
}

?>