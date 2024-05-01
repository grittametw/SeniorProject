var express = require( 'express' )
var mysql = require( 'mysql' )
const colorDiff = require('color-diff');

var database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_layduna",
});

var app = express()
app.use(express.json())

app.use(express.static('views'))

app.set('view engine', 'ejs');

app.listen(3000, function () {
    console.log("Server listening on port: 3000")
})

app.get('/', function (req, res, next) {
    // Retrieve the latest ID from the database
    database.query(
        'SELECT id_users FROM users ORDER BY id_users DESC LIMIT 1',
        function(err, results, fields) {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            
            // If there are results from the recent ID retrieval
            if (results.length > 0) {
                const latestId = results[0].id_users;

                // Retrieve user data from latest ID
                database.query(
                    'SELECT * FROM users WHERE id_users = ?',
                    [latestId],
                    function(err, results, fields) {
                        if (err) {
                            res.status(500).send(err.message);
                            return;
                        }

                        // Retrieve color values ​​R, G, B from database
                        const skinColorRGB = { 
                            R: results[0].color_r,
                            G: results[0].color_g,
                            B: results[0].color_b 
                        };

                        // All tone colors
                        const availableColors = [
                            { name: '01', R: 253, G: 240, B: 214 },
                            { name: '02', R: 250, G: 227, B: 186 },
                            { name: '03', R: 233, G: 193, B: 133 },
                            { name: '04', R: 209, G: 157, B: 100 },
                            { name: '05', R: 248, G: 224, B: 194 },
                            { name: '06', R: 248, G: 215, B: 176 },
                            { name: '07', R: 226, G: 176, B: 139 },
                            { name: '08', R: 205, G: 152, B: 108 },
                            { name: '09', R: 250, G: 222, B: 201 },
                            { name: '10', R: 250, G: 199, B: 167 },
                            { name: '11', R: 218, G: 152, B: 117 },
                            { name: '12', R: 188, G: 124, B: 88 },
                        ];

                        let closestColor = availableColors[0];
                        let minDistance = colorDiff.diff(skinColorRGB, closestColor);

                        for (let i = 1; i < availableColors.length; i++) {
                            const distance = colorDiff.diff(skinColorRGB, availableColors[i]);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestColor = availableColors[i];
                            }
                        }
                        res.render('home', { users: results, closestColor: closestColor });
                    }
                );
            } else {
                res.status(404).send("No user found.");
            }
        }
    );
})

app.get('/:id_users', function (req, res, next) {
    const id = req.params.id;
    database.query(
      'SELECT * FROM users WHERE id_users = ?',
      [id],
      function(err, results) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        
        // If there are results from the recent ID retrieval
        if (results.length > 0) {
            const latestId = results[0].id;

            // Retrieve user data from latest ID
            database.query(
                'SELECT * FROM users WHERE id_users = ?',
                [latestId],
                function(err, results, fields) {
                    if (err) {
                        res.status(500).send(err.message);
                        return;
                    }
        
                    // Retrieve color values ​​R, G, B from database
                    const skinColorRGB = { 
                        R: results[0].color_r, 
                        G: results[0].color_g, 
                        B: results[0].color_b 
                    };
        
                    // All tone colors
                    const availableColors = [
                        { name: '01', R: 253, G: 240, B: 214 },
                        { name: '02', R: 250, G: 227, B: 186 },
                        { name: '03', R: 233, G: 193, B: 133 },
                        { name: '04', R: 209, G: 157, B: 100 },
                        { name: '05', R: 248, G: 224, B: 194 },
                        { name: '06', R: 248, G: 215, B: 176 },
                        { name: '07', R: 226, G: 176, B: 139 },
                        { name: '08', R: 205, G: 152, B: 108 },
                        { name: '09', R: 250, G: 222, B: 201 },
                        { name: '10', R: 250, G: 199, B: 167 },
                        { name: '11', R: 218, G: 152, B: 117 },
                        { name: '12', R: 188, G: 124, B: 88 },
                    ];
        
                    let closestColor = availableColors[0];
                    let minDistance = colorDiff.diff(skinColorRGB, closestColor);
        
                    for (let i = 1; i < availableColors.length; i++) {
                        const distance = colorDiff.diff(skinColorRGB, availableColors[i]);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestColor = availableColors[i];
                        }
                    }
                    res.render('home', { users: results, closestColor: closestColor });
                }
            );
        } else {
            res.status(404).send("No user found.");
        }
    });
})