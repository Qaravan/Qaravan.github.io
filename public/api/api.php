<?php
header('Content-Type: application/json; charset=utf-8');

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.novaposhta.ua/v2.0/json/',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'{
   "apiKey": "",
   "modelName": "TrackingDocument",
   "calledMethod": "getStatusDocuments",
   "methodProperties": {
    "Documents" : [{
        "DocumentNumber":"' . urlencode($_GET['number']) . '",
        "Phone":""
    }]
   }
  }',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json',
    'Cookie: PHPSESSID=q53vukru80j0mqs04tplsvtn1u; YIICSRFTOKEN=063d2c7673caf6788ef2c1b2fe8e799244e4a89es%3A88%3A%22M2ExZmI1dWxNbjROamZXTVlFZWZzY0NCM1hUV0RafncD3PSjyAcrsXhTESOlIlqjMNVGHQ_mi0kwqmMkKFwKCg%3D%3D%22%3B'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
$json = json_decode($response, true);
if ($json["data"][0]["StatusCode"] == "9" || $json["data"][0]["StatusCode"] == "10" || $json["data"][0]["StatusCode"] == "11") {
    echo "{\"status\":2}";
} else if ($json["data"][0]["StatusCode"] == "102" || $json["data"][0]["StatusCode"] == "103") {
    echo "{\"status\":3}";
} else {
    echo "{\"status\":1}";
}
