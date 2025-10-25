const http = require("http");
const url = require("url");

const data = []; // Database

// Creating a new server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathName === "/") {
    res.setHeader("content-type", "text/html");
    res.statusCode = 200;

    res.write(`<!DOCTYPE html>`);
    res.write(`<html lang="en">`);
    res.write(`<head>`);
    res.write(`<meta charset="UTF-8">`);
    res.write(
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
    );
    res.write(`<title>CRUD Application</title>`);
    res.write(`
            <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                list-style-type: none;
            }
            body{
                display: grid;
                height: 100vh;
                padding: 50px;
            }
            main > form{
                padding: 10px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            main > form input[type='text']{
                flex: 1;
                padding: 0 5px;
                height: 5vh;
                border-radius: 10px;
            }

            main > form button{
                padding: 0 30px;
                height: 5vh;
                border: none;
                background-color: #fff;
                outline: solid 1px #000;
                color: #000;
                cursor: pointer;
                border-radius: 10px;
            } 
            main > form button:hover{
                background-color: #000;
                color: #fff;
            }

            main ul {
              display: flex;
              flex-direction: column;
              gap: 10px;
              padding: 20px;
              overflow-y: auto;
              height: 80vh;
            }
            
            main ul li{
              box-shadow: 0 0 10px rgba(0,0,0.5);
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              padding: 10px;
              gap: 20px;
              border-radius: 10px;
            }

            main ul li button{
              padding: 0 15px;
              border: none;
              
              background-color: #fff;
              border-radius: 10px;
              cursor: pointer;
            }
            
            main li form button{
              outline: 1px solid blue;
              color: blue;
            }

            main li a button{
              outline: 1px solid red;
              color: red;
            }
            main li > div:nth-child(3){
              flex: 1
            }
            main li > div:nth-child(3) form{
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              gap: 10px
            }
            main li > div:nth-child(3) input{
              flex: 1;
              height: 4vh;
              padding: 0 10px;
            }

            @media (max-width: 576px) {
              body{
                padding: 0px;
              }
            }
        </style>
        `);
    res.write(`</head>`);
    res.write(`<body>`);
    res.write(`<main>`);
    res.write(`
        <form action="/new-task">
            <input type="text" name="newTask" placeholder="Enter a task">
            <button type="submit">Submit</button>
        </form>
        `);
    res.write(`
            <ul>
                ${
                  data.length > 0
                    ? `
                        ${data
                          .map(
                            (item, idx) => `
                                <li>
                                  <div>${idx + 1}</div>
                                  <div>${item}</div>
                                  <div>
                                    <form action="/update-task">
                                      <input type="hidden" name="index" value="${idx}">
                                      <input type="text" name="taskUpdated" placeholder="Update task">
                                      <button type="submit">Update</button>
                                    </form>
                                  </div>
                                  <div>
                                    <a href="/delete-task?index=${idx}">
                                      <button>Delete</button>
                                    </a>
                                  </div>
                                </li>
                            `
                          )
                          .join("")}
                    `
                    : `<li>
                          <div style="text-align: center">No Task Added</div>
                    </li>`
                }
            </ul>
        `);
    res.write(`</main>`);
    res.write(`</body>`);
    res.write(`</html>`);
    res.end();
  } else if (pathName === "/new-task") {
    const inputVal = query.newTask;
    if (inputVal && inputVal.trim() !== "") {
      data.push(inputVal.trim());
    }
    res.writeHead(302, { location: "/" });
    res.end();
  } else if (pathName === "/update-task") {
    const index = query.index;
    const updatedTask = query.taskUpdated;

    if (data[index] !== undefined && updatedTask) {
      data[index] = updatedTask;
    }

    res.writeHead(302, { location: "/" });
    res.end(() => {
      console.info(`Task updated at index value ${index}`);
    });
  } else if (pathName === "/delete-task") {
    const index = query.index;

    if (index && data[index]) {
      data.splice(index, 1);
    }

    res.setHeader("Location", "/");
    res.statusCode = 302;
    res.end(() => {
      console.info(`Task delete!`);
    });
  } else {
    res.writeHead(404, { "content-type": "text/html" });
    res.end("<h1>404 Not Found!</h1>");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.info(`Server running at http://localhost:${PORT}`);
});
