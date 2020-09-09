"use strict";

let API_URL = window.env.apiUrl;
let MAILER_API_URL = window.env.nodemailerApiUrl;

const apiRequest = async (method, path, body = null) => {
  console.log("Making api request from frontend");

  let data;
  let res;
  let actual_body = null;
  if (body !== null) {
    actual_body = JSON.stringify(body)
  }
  let opts = {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: actual_body
  };

  try {
    if (method === "GET") {
      res = await fetch(API_URL + path);
    } else {
      res = await fetch(API_URL + path, opts);
    }
    data = await res.json();
  } catch (e) {
    alert(e.message);
    throw e;
  }

  console.log("Stored in database");
  let complete_url = window.env.nodemailerApiUrl[0];
  console.log(complete_url);
  // Mailing api request
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "POST", complete_url, true ); // false for synchronous request
  xmlHttp.setRequestHeader('Content-type', 'application/json');
  xmlHttp.onload = function (e) {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        console.log(xmlHttp.responseText);
      } else {
        console.error(xmlHttp.statusText);
      }
    }
  };
  xmlHttp.onerror = function (e) {
    console.error(xmlHttp.statusText);
  };
  
  xmlHttp.send(actual_body);
  let res2 = xmlHttp.responseText;
  console.log(res2);
  console.log("email sent to merchant");

  return [res.status, data];
};

window.apiRequest = apiRequest;
export default apiRequest;
