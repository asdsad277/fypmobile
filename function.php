<?php 
require("config.php");
$json = file_get_contents("php://input");
$obj = json_decode($json, true);
$option=$obj["option"];
error_reporting(0);
date_default_timezone_set("HongKong");
function getID($table,$col)
{
	$sql = "Select * from ".$table;
	$rs = mysqli_query($conn, $sql) or die (mysqli_error($conn));
	$ID = 1;				
	while($rc = mysqli_fetch_assoc($rs)) {
		if ($rc[$col]==$ID){
		$ID++;
		}
	}
	return $ID;
}	
switch($option){
    case "login":
        $ac = $obj["ac"];
        $pw = $obj["pw"];
        if ($obj["ac"] != null || $obj["ac"] != "" || $obj["pw"] != null || $obj["pw"] != "") {
            $sql = "Select * from Account where AccountID ='" . $ac . "' and Password ='" . $pw . "';";
            $rs = mysqli_query($conn, $sql) or die(mysqli_error($conn));
            $rc	= mysqli_num_rows($rs);
            if ($rc == 0) {
                echo json_encode('Wrong Password/AccountID!');
            } else {
                echo json_encode('true');
            }
        } else {
            echo json_encode('Password and AccountID Cannot be Empty!');
        }
		mysqli_free_result($rs);
		break;
    case "load":
        $sql = "Select * from shop;";
        $rs = mysqli_query($conn, $sql) or die(mysqli_error($conn));
        while($rc = mysqli_fetch_assoc($rs)){
			$re[]=$rc;
        }
		echo json_encode($re);
		mysqli_free_result($rs);
		break;
    case "loadticket":
		$id=$obj['para'];
		$sql = "SELECT t.TicketID,s.Name,tr.NumOfSeat,t.Date FROM ticketinforestaurant tr, ticket t , account a, customer c , shop s WHERE tr.TicketID = t.TicketID and a.AccountID=c.AccountID and t.CustomerID = c.CustomerID and s.ShopID= t.ShopID and a.accountID = '".$id."' ";
		$sql .= "order by t.Date";
        $rs = mysqli_query($conn, $sql) or die(mysqli_error($conn));
        while($rc = mysqli_fetch_assoc($rs)){
			$re[]=$rc;
        }
		echo json_encode($re);
		mysqli_free_result($rs);
		break;
    case "loadfav":
		$id = $obj['para'];
		$sql = "SELECT * FROM favoritelist f, Shop s,restaurant r, customer c WHERE f.ShopID = s.ShopID and s.ShopID= r.ShopID and c.CustomerID = f.CustomerID and c.AccountID = '".$id."'";
		$rs = mysqli_query($conn, $sql) or die (mysqli_error($conn));
		while($rc = mysqli_fetch_assoc($rs)){
			$re[]=$rc;
        }
		echo json_encode($re);
		mysqli_free_result($rs);
    break;
    case "loadshop":
		$para=$obj['para'];
		$sql = "Select * from shop where shopID ='".$para."';";
        $rs = mysqli_query($conn, $sql) or die(mysqli_error($conn));
        while($rc = mysqli_fetch_assoc($rs)){
			$re[]=$rc;
        }
		echo json_encode($re);
		mysqli_free_result($rs);
	break;
	case "loaduser":
		$para = $obj['para'];
		$sql = "Select * from account where AccountID ='".$para."';";
		$rs = mysqli_query($conn, $sql) or die(mysqli_error($conn));
        while($rc = mysqli_fetch_assoc($rs)){
			$re[]=$rc;
        }
		echo json_encode($re);
		mysqli_free_result($rs);
		break;
	case "getticket":
		$shopid = $obj['shopid'];
		$ac = $obj['ac'];
		$numppl=$obj['numppl'];
		$ticketid=getID("shop","TicketID");
		$seq=getID("shop","sequence");
		$sql = "INSERT INTO ticket VALUES ('".$ticketid."', '".$shopid."', '".$ac."','".date("Y-m-d")."','".date("H:i:s")."','".$seq."');";
		$rs = mysqli_query($conn, $sql) or die(mysqli_error($conn));
		$ticketinfo=getID("ticketinforestaurant","TicketInfoRestaurantID");
		$sql1="INSERT INTO TicketInfoRestaurantID VALUES ('".$ticketinfo."', '".$numppl."','".$ticketid."');";
		$rs1 = mysqli_query($conn, $sql) or die(mysqli_error($conn));
		$rc	= mysqli_num_rows($rs);
		$rc1 = mysqli_num_rows($rs1);
		if($rc1==1&&$rc==1){
			echo json_encode("true");
		}else{
			echo json_encode("false");
		}
	break;
    default:
		echo json_encode("error occur");
		
}

?>
