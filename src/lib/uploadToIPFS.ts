import axios from "axios";

export default function uploadToIPFS(file: any, cid: any) {
  var formData = new FormData();
  formData.append("file", file || "");
  axios
    .post("https://api.web3.storage/upload", formData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGNBYjNkQjI4ODY3MTAyMGU1NmYxNjU1MDVlQ0E0MGE4NDY2NGQwNWIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njg3Nzk0MjE3MTcsIm5hbWUiOiJORlQifQ.4_2s-LFu0Qhp8DP8atx3-8I3r5CICAQ_byszxQzQ8nw`,
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
