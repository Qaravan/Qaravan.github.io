import axios from "axios";

export default function uploadToIPFS(file: any, cid: any) {
  var formData = new FormData();
  formData.append("file", file || "");
  axios
    .post("https://api.web3.storage/upload", formData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZFNjNDOWUxMDFCZjRDYTgzNWFhQjdkQTg0OTAwOTc3MTMwMjkxY0YiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njc4NTc2NDczODksIm5hbWUiOiJBUEkifQ.dRV0-fmzbAHfASDC5YxCM6Ui_oRdP7r2kWIskUeC_48`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      cid(response.data.cid);
    })
    .catch(function (error) {
      console.log(error);
    });
}
