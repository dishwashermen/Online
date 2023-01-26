<?php

class DBWORKER {
	
	private $DBHD, $logname, $cphrase, $cmode, $ckey; 
	
	function __construct($host, $dbname, $charset, $dblogin, $dbpass) {
		
		try { 
		
			$this -> DBHD = new PDO('mysql:host=' . $host . ';dbname=' . $dbname . ';charset=' . $charset, $dblogin, $dbpass, array(PDO :: ATTR_ERRMODE => PDO :: ERRMODE_EXCEPTION)); 
			
		}  
	
		catch(PDOException $e) {
			
			customErrorHandler(0, $_SERVER['REMOTE_ADDR'] . "\n\n" . $e -> getMessage(), false, false, false);
			
			$this -> DBHD = null;
		
			die(); 
	
		}
		
	}
	
	public function prep($qstring, $data = null) {
		
		global $_POST;
		
		if ($data !== null) if (! is_array($data)) $data = array($data);
		
		try {
			
			$f = preg_match('/insert/i', $qstring) ? true : false;
			
			$query = $this -> DBHD -> prepare($qstring);
			
			$this -> DBHD -> beginTransaction();
			
			$data ? $query -> execute($data) : $query -> execute();
			
			$id = $f ? $this -> DBHD -> lastInsertId() : 0;
				
			$this -> DBHD -> commit();

			return $f ? $id : $query;

		}
		
		catch(PDOException $e) {
			
			$this -> DBHD -> rollback();
			
			if ($data) {
				
				ob_start();
				
				foreach ($data as $key => $val) {
					
					var_dump($val);
					
					$data[$key] = "Data[" . $key . "]\t\t" . ob_get_contents();
					
					ob_clean();
					
				}
				
				ob_end_flush();
				
			}
			
			customErrorHandler(1, $_SERVER['REMOTE_ADDR'] . "\n\n" . $e -> getMessage() . "\n\nQuery String:\t" . $qstring . ($data ? "\n\n" . implode('', $data) : ''), false, false, false);
			
			$this -> DBHD = null;
				
			die(); 
			
		}
		
	}
	
	public function close() {
		
		$this -> DBHD = null;
		
		die();
		
	}
	
	public function quote($str) {
		
		return $this -> DBHD -> quote($str);
		
	}	
	
}

function pr($a) {
	
	echo '<hr><br>';
	
	$n = 0;

	foreach($a as $key => $val) {
	
		echo '<i>' . $n . '</i> <b>' . $key . ':</b>&nbsp;&nbsp;';
	
		print_r($val);
		
		echo '<br><br>';
		
		$n ++;
	
	}
	
	echo '<hr>';

}

function logger($log, $uid = false, $post = true) {
	
	global $_POST;
	
	$DateString = date('jS-M-y H-i-s');
	
	$DashString = str_repeat('-', 58 - strlen($DateString) - strlen($log));
	
	preg_match('/' . str_replace('/', '\/', $_SERVER['DOCUMENT_ROOT']) . '\/(\w*)/', $_SERVER['SCRIPT_FILENAME'], $dirname);
	
	$Dir = $_SERVER['DOCUMENT_ROOT'] . '/Log/' . $dirname[1] . '/' . $_POST['ProjectId'] . '/';
	
	if (! file_exists($Dir)) mkdir($Dir, 0755, true);
	
	$FN = $uid ? $uid : $_POST['UserId'];
	
	$PostString = '';
	
	if ($post) {
		
		$InitKey = true;
		
		foreach ($_POST as $key => $val) {
			
			if ($InitKey) {
				
				if (! Preg_match('/ProjectId|UserId|DirectRule|AuthType|Autofill|StateIndex|Separate|SeparateIndex|HistoryState|Total|JournalIndex|JournalState|ProjectLimiting|Limit|ViewContent/', $key)) {
				
					$InitKey = false;
					
					$PostString .= "\n" . $key . ":\t" . $val . "\n";
				
				} else $PostString .= $key . ":\t" . $val . "\n";
				
			} else $PostString .= $key . ":\t" . $val . "\n";

		}
		
	}
	
	file_put_contents($Dir . $FN . '.log', $DateString . ' ' . $DashString . ' ' . $log . "\n\n" . ($post ? $PostString . "\n" : ''), 
	
		FILE_APPEND);
	
}

function customErrorHandler($errno, $errstr, $filename, $linenum, $vars) {
	
	global $_POST;
	
	$ErrorType = array (
	
		0 => 'DB Connect Error',
		
		1 => 'DB Error',
	
    	E_ERROR => 'Error',
				
        E_WARNING  => 'Warning',
				
        E_PARSE => 'Parsing Error',
				
        E_NOTICE => 'Notice',
				
        E_CORE_ERROR => 'Core Error',
				
        E_CORE_WARNING => 'Core Warning',
				
        E_COMPILE_ERROR => 'Compile Error',
				
        E_COMPILE_WARNING => 'Compile Warning',
				
        E_USER_ERROR => 'User Error',
				
        E_USER_WARNING => 'User Warning',
				
        E_USER_NOTICE => 'User Notice',
				
        E_STRICT => 'Runtime Notice'
				
    );
	
	$UserErrors = array(E_USER_ERROR, E_USER_WARNING, E_USER_NOTICE);

	preg_match('/' . str_replace('/', '\/', $_SERVER['DOCUMENT_ROOT']) . '\/(\w*)/', $_SERVER['SCRIPT_FILENAME'], $dirname);
	
	$Data = date('jS-M-y H-i-s') . "\t" . $ErrorType[$errno] . "\n\n" . ($filename ? $filename . " - " . $linenum . "\n\n" : '');
	
	if (in_array($errno, $UserErrors))  $Data .= wddx_serialize_value($vars, 'Variables') . "\n\n";
	
	$Data .= $errstr . "\n\n";
	
	$PostString = '';
	
	$InitKey = true;
		
	foreach ($_POST as $key => $val) {
		
		if ($InitKey) {
			
			if (! Preg_match('/ProjectId|UserId|DirectRule|AuthType|Autofill|StateIndex|Separate|SeparateIndex|HistoryState|Total|JournalIndex|JournalState|ProjectLimiting|Limit|ViewContent/', $key)) {
			
				$InitKey = false;
				
				$PostString .= $key . ":\t" . $val . "\n";
			
			} else $PostString .= $key . ":\t" . $val . "\n";
			
		} else $PostString .= $key . ":\t" . $val . "\n";

	}
	
	$Data .= "POST:\n\n" . $PostString . "\n-----------------------------------------------------\n\n";

	file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/Log/' . $dirname[1] . '_error', $Data, FILE_APPEND);
	
	return false;
	
}

function preg_array_key_exists($pattern, $array) {
	
    $keys = array_keys($array);    
	
    return count(explode('|', $pattern)) === count(preg_grep($pattern, $keys));
	
}

function str_replace_once($search, $replace, $text){
	
   $pos = strpos($text, $search);
   
   return $pos!==false ? substr_replace($text, $replace, $pos, strlen($search)) : $text;
   
}

error_reporting(0);

set_error_handler('customErrorHandler');

?>