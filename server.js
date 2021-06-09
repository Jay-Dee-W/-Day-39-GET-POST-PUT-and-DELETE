const http = require("http");
let users = [
    {
        id: 1,
        createdAt: "2021-05-31T10:59:02.663Z",
        name: "Don Hessel",
        avatar: "https://cdn.fakercloud.com/avatars/id835559_128.jpg",
    },
    {
        id: 2,
        createdAt: "2021-06-01T02:09:32.743Z",
        name: "Rudy McLaughlin",
        avatar: "https://cdn.fakercloud.com/avatars/naitanamoreno_128.jpg",
    },
    {
        id: 3,
        createdAt: "2021-05-31T07:10:14.018Z",
        name: "Dianne Beier",
        avatar: "https://cdn.fakercloud.com/avatars/theonlyzeke_128.jpg",
    },
    {
        id: 4,
        createdAt: "2021-05-31T23:52:35.521Z",
        name: "Natasha Schaden",
        avatar: "https://cdn.fakercloud.com/avatars/uxward_128.jpg",
    },
    {
        id: 5,
        createdAt: "2021-05-31T11:55:49.052Z",
        name: "Debbie Russel MD",
        avatar: "https://cdn.fakercloud.com/avatars/malgordon_128.jpg",
    },
    {
        id: 6,
        createdAt: "2021-05-31T16:23:08.597Z",
        name: "Gloria Douglas",
        avatar: "https://cdn.fakercloud.com/avatars/marcobarbosa_128.jpg",
    },
];


const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    let user 
    switch (req.method) {
      
        case "GET":
           console.log('getting')
            res.write(JSON.stringify(users));
            res.statusCode = 200;
            res.end();
            return;

        case "POST":
            console.log('posting')
           user = ''
            req.on("data", (chunk) => {
                user += chunk;
            });
            req.on("end", () => {
                let userToAdd = JSON.parse(user);
                if (!userToAdd.name || !userToAdd.avatar) {
                    res.statusCode = 400;
                    res.end("invalid name or avatar");
                    return;
                }
                userToAdd.id = user.length
                userToAdd.createdAt = new Date();
                users.push(userToAdd);
                res.end(
                    `User ${user} is successfully created at: ${userToAdd.createdAt} \n With ID: ${userToAdd.id}`
                );
                res.statusCode = 203;
            });
            return;



        case "DELETE":
            console.log('deleting' ,Number(req.url.substring(6)))
            let userToDelete = Number(req.url.substring(6));
            let filterUsers = users.filter( user => Number(user.id) !== userToDelete);

            return (filterUsers.length === users.length)
                ? (res.statusCode = 403, res.end(`User ${userToDelete}  not found`))
                : (users = filterUsers, res.statusCode = 200, res.end(`User ${userToDelete} deleted`))



        case "PUT":
            console.log('putting')
            let userToUpdate = Number(req.url.substring(6));
            let i = users.findIndex((el) => Number(el.id) === userToUpdate);
            if (i === -1) {
                res.statusCode = 403;
                res.end("User not found,  Please send valid id");
                return;
            }
            user = '';
            req.on("data", (chunk) => {
                user += chunk;
            });
            req.on("end", () => {
                if (user === "") {
                    res.statusCode = 400;
                    res.end(
                        "Please send user info"
                    );
                }
                let thingsToUpdate = JSON.parse(user);
                if (thingsToUpdate.name === "" || thingsToUpdate.avatar === "") {
                    res.statusCode = 400;
                    res.end("Please send valid name or avatar.");
                    return;
                }

                (thingsToUpdate.name) ?  users[i]["name"] = thingsToUpdate.name  :  users[i]["avatar"] = thingsToUpdate.avatar;

                res.statusCode = 203;
                res.end(
                    "Updated data: " +   JSON.stringify(users[i])
                );
            });
            return;
    }
    res.end("Invalid endpoint");
    return;
});
server.listen(8000, 'localhost', () => {
    console.log('Server is listening on 8000')
})