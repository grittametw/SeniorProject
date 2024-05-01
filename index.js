//code มี database ล่าสุด

var express = require('express');
var router = express.Router();
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
// Require the mysql package
const mysql = require('mysql');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test_layduna',
});

const sp = new SerialPort({ 
  path : "COM5", 
  baudRate: 250000,
});

const parser = sp.pipe(new ReadlineParser({ delimiter: '\r\n' }))

var app = express();
app.use(express.json());

app.listen(5000, function(){
    console.log("Server listening on port: 5000")
});

app.get('/', function (req, res) {
    database.query(
      'SELECT z1_x, z1_y, z1_z, z2_x, z2_y, z2_z, z3_x, z3_y, z3_z, z4_x, z4_y, z4_z, z5_x, z5_y, z5_z, z6_x, z6_y, z6_z FROM zone ORDER BY id_zone DESC LIMIT 1',
      function(err, results) {
        if (err) {
          res.status(500).send(err.message);
          return;
        }

        //If there are results from the recent ID retrieval
        if (results.length > 0) {
          
          var x_HomeStart = 0
          var y_HomeStart = 0
          var z_HomeStart = 0

          //-----------Home Camera------------------
          var HomeCamera_x = `G1 X-280 Z0 F8000`;
          var HomeCamera_y = `G1 X-280 Y-90 Z0 F8000`;

          // ********* cosmetics position **********
          //-----level1 pick up foundation-----------
          var L1_foundation_z = `G1 X0 Y-8.6 Z-17 F8000`;
          //-----level2 pick up blush----------------
          var L2_brush_y = `G1 X0 Y-78 Z0 F8000`
          var L2_brush_z = `G1 X0 Y-78 Z-16 F8000`
          //-----level3 pick up lipstick-------------
          var L3_lips_y = `G1 X0 Y-158 Z0 F8000`
          var L3_lips_z = `G1 X0 Y-158 Z-15.5 F8000`

          var X_zone1 = (-1)*(results[0].z1_x - (-283.97));         //zone1 nose x,y,z
          var Y_zone1 = (-1)*(results[0].z1_y - (-25.39));
          var Z_zone1 = (-1)*(results[0].z1_z - 290);

          var X_zone2 = (-1)*(results[0].z2_x - (-284.08));         //zone2 forehead x,y,z
          var Y_zone2 = (-1)*(results[0].z2_y - (-85));
          var Z_zone2 = (-1)*(results[0].z2_z - 298);

          var X_zone3 = (-1)*(results[0].z3_x - (-386.62));         //zone3 right cheek x,y,z
          var Y_zone3 = (-1)*(results[0].z3_y - (-20.26));
          var Z_zone3 = (-1)*(results[0].z3_z - 306);

          var X_zone4 = (-1)*(results[0].z4_x - (-191.83));          //zone4 left cheek x,y,z
          var Y_zone4 = (-1)*(results[0].z4_y - (-20.26));
          var Z_zone4 = (-1)*(results[0].z4_z - 306);

          var X_zone5 = (-1)*(results[0].z5_x - (-284.04));         //zone5 chin x,y,z
          var Y_zone5 = (-1)*(results[0].z5_y - 12.54);
          var Z_zone5 = (-1)*(results[0].z5_z - 301);

          var X_zone6 = (-1)*(results[0].z6_x - (-284.02));         //zone6 mouth x,y,z
          var Y_zone6 = (-1)*(results[0].z6_y - 10.27);
          var Z_zone6 = (-1)*(results[0].z6_z - 304);

          //Calculate position
          var Z2_X_r1 = X_zone2 - 30;      //zone2 forehead
          var Z2_X_r2 = X_zone2 - 90;
          var Z2_X_l1 = X_zone2 + 30;
          var Z2_X_l2 = X_zone2 + 90;
          var Zone2_Z1 = Z_zone2 - 1;
          var Zone2_Z2 = Z_zone2 - 5;
          var Z3_X_r = X_zone3 - 50;       //zone3 nose
          var z3_y1 = Y_zone3 + 20;         // เพิ่ม
          var z3_z1 = Z_zone3 -4;           // เพิ่ม
          var z3_z2 = Z_zone3 -7;           // เพิ่ม
          var Zone3_Z = Z_zone3 - 2;
          var Z4_X_l = X_zone4 + 50;       //zone4 left cheek
          var z4_y1 = Y_zone4 + 20;         // เพิ่ม
          var z4_z1 = Z_zone4 - 4;          // เพิ่ม
          var z4_z2 = Z_zone4 - 7;          // เพิ่ม
          var Z5_X_r = X_zone5 - 20;       //zone5 right cheek
          var Z5_X_l = X_zone5 + 20;
        
          var HomeStart = `G1 X${x_HomeStart} Y${y_HomeStart} Z${z_HomeStart} F8000`


          // ***********Send variable G-Code value (Position Zone 1-6)***************
          //zone1
          var Z1_Nose_xy = `G1 X${X_zone1} Y${Y_zone1} F8000`;
          var Z1_Nose_z = `G1 X${X_zone1} Y${Y_zone1} Z${Z_zone1} F8000`;
          //zone2
          var Z2_Forehead_xy = `G1 X${X_zone2} Y${Y_zone2} F8000`;
          var Z2_Forehead_z = `G1 X${X_zone2} Y${Y_zone2} Z${Z_zone2} F8000`;
          var z2_right1 =  `G1 X${Z2_X_r1} Z${Zone2_Z1} F3000`;
          var z2_right2 =  `G1 X${Z2_X_r2} Z${Zone2_Z2} F3000`;
          var z2_left1 =  `G1 X${Z2_X_l1} Z${Zone2_Z1} F3000`;
          var z2_left2 =  `G1 X${Z2_X_l2} Z${Zone2_Z2} F3000`;
          //zone3
          //บน
          var Z3_RightCheek_xy1 = `G1 X${X_zone3} Y${Y_zone3} F8000`;
          var Z3_RightCheek_z1 = `G1 X${X_zone3} Y${Y_zone3} Z${z3_z1} F8000`;
          var Z3_right1 =  `G1 X${Z3_X_r} Z${z3_z1} F3000`;
          var Z3_RightCheek_z_blush = `G1 X${X_zone3} Y${Y_zone3} Z${Z_zone3 - 3} F8000`;
          var Z3_right_blush =  `G1 X${Z3_X_r} Z${Z_zone3 - 5} F3000`;
          //เพิ่ม ล่าง
          var Z3_RightCheek_xy2 = `G1 X${X_zone3} Y${z3_y1} F8000`;
          var Z3_RightCheek_z2 = `G1 X${X_zone3} Y${z3_y1} Z${z3_z1} F8000`;
          var Z3_right2 =  `G1 X${Z3_X_r} Z${z3_z2} F3000`;
          //zone4
          //บน
          var Z4_LeftCheek_xy1 = `G1 X${X_zone4} Y${Y_zone4} F8000`;
          var Z4_LeftCheek_z1 = `G1 X${X_zone4} Y${Y_zone4} Z${z4_z1} F8000`;
          var Z4_left1 =  `G1 X${Z4_X_l} Z${z4_z1} F3000`;
          var Z4_LeftCheek_z_blush = `G1 X${X_zone4} Y${Y_zone4} Z${Z_zone4} F8000`;
          var Z4_left_blush =  `G1 X${Z4_X_l} Z${Z_zone4 - 5} F3000`;
          //เพิ่ม ล่าง
          var Z4_LeftCheek_xy2 = `G1 X${X_zone4} Y${z4_y1} F8000`;
          var Z4_LeftCheek_z2 = `G1 X${X_zone4} Y${z4_y1} Z${z4_z1} F8000`;
          var Z4_left2 =  `G1 X${Z4_X_l} Z${z4_z2} F3000`;
          //zone5
          var Z5_Chin_xy = `G1 X${X_zone5} Y${Y_zone5} F8000`;
          var Z5_Chin_z = `G1 X${X_zone5} Y${Y_zone5} Z${Z_zone5} F8000`;
          var Z5_right =  `G1 X${Z5_X_r} F3000`;
          var Z5_left =  `G1 X${Z5_X_l} F3000`;
          //zone6
          var Z6_Mouth_xy = `G1 X${X_zone6} Y${Y_zone6} F8000`;
          var Z6_Mouth_z = `G1 X${X_zone6} Y${Y_zone6} Z${Z_zone6}F8000`;

          //back
          var Z_20 = `G1 Z-20 F8000`;
          var Z_0 = `G1 Z0 F8000`;
          var X_0 = `G1 x0 F8000`;
          //setting magnetic
          var magnetic_Open =`M106`;        
          var magnetic_Close =`M107`;      
          //setting servo motor
          var Servo_Start = `M280 P0 S0`
          var Servo_Center = `M280 P0 S58`
          var Servo_left = `M280 P0 S35`
          var Servo_right = `M280 P0 S85`
          //setting time
          var finish = `M400`  
          var delay_1500 = `G4 P1500`   
          var delay_3000 = `G4 P3000`

          setTimeout(function() {

            // Function to send G-code commands
            function sendGCode(command) {
              sp.write(command + '\n', function(err) {
                if (err) {
                  return console.log('Error: ', err.message);
                }
                console.log(`Sent: ${command}`);
              });
            }
            
            //################## Home ##################
                sendGCode(Servo_Start);           //set servo
                sendGCode(Servo_Center);          //set servo
                sendGCode(HomeStart);             //x=0 y=0 z=0


            //############## Put on makeup #############
            //------process 1 Apply foundation---------
                sendGCode(magnetic_Open);         //magnetic open
                sendGCode(L1_foundation_z);       //Level 1
                sendGCode(Z_0);                   //z=0
                sendGCode(HomeCamera_x);          //home camera
                sendGCode(HomeCamera_y);          //home camera
                sendGCode(finish);
                 //Round 1 (Zone2) Apple foundation on the forehead. 
                sendGCode(Z2_Forehead_xy);        //zone2
                sendGCode(Z2_Forehead_z);
                sendGCode(z2_right1);
                sendGCode(finish); 
                sendGCode(Servo_right);
                sendGCode(z2_right2);
                sendGCode(z2_right1);
                sendGCode(finish); 
                sendGCode(Servo_Center);
                sendGCode(z2_left1);
                sendGCode(finish); 
                sendGCode(Servo_left);
                sendGCode(z2_left2);
                sendGCode(z2_left1);
                sendGCode(finish); 
                sendGCode(Servo_Center);
                sendGCode(Z2_Forehead_z);
                sendGCode(Z2_Forehead_xy);  
                 //Round 2 (Zone2) Apple foundation on the forehead.
                sendGCode(z2_right1);                //zone2
                sendGCode(finish); 
                sendGCode(Servo_right);
                sendGCode(z2_right2);
                sendGCode(z2_right1);
                sendGCode(finish); 
                sendGCode(Servo_Center);
                sendGCode(z2_left1);
                sendGCode(finish); 
                sendGCode(Servo_left);
                sendGCode(z2_left2);
                sendGCode(z2_left1);
                sendGCode(finish); 
                sendGCode(Servo_Center);
                sendGCode(Z2_Forehead_z);
                sendGCode(Z2_Forehead_xy);  
                sendGCode(Z_20);                  //back z20
                 //Round 1 (Zone3) Apple foundation on the right cheek.
                sendGCode(Z3_RightCheek_xy1);      //zone3
                sendGCode(finish); 
                sendGCode(Servo_right);
                sendGCode(Z3_RightCheek_z1);
                sendGCode(Z3_right1);
                sendGCode(finish); 
                sendGCode(Servo_Center);
                //Round 2 (Zone3) Apple foundation on the right cheek.
                sendGCode(Z_20);                  //back z20
                sendGCode(Z3_RightCheek_xy1);      //zone3
                sendGCode(finish); 
                sendGCode(Servo_right);
                sendGCode(Z3_RightCheek_z1);
                sendGCode(Z3_right1);
                sendGCode(finish); 
                sendGCode(Servo_Center);
                sendGCode(Z_20);                  //back z20
//add
                 //Round 1 (Zone3) Apple foundation on the right cheek.
                 sendGCode(Z3_RightCheek_xy2);      //zone3
                 sendGCode(finish); 
                 sendGCode(Servo_right);
                 sendGCode(Z3_RightCheek_z2);
                 sendGCode(Z3_right2);
                 sendGCode(finish); 
                 sendGCode(Servo_Center);
                 //Round 2 (Zone3) Apple foundation on the right cheek.
                 sendGCode(Z_20);                  //back z20
                 sendGCode(Z3_RightCheek_xy2);      //zone3
                 sendGCode(finish); 
                 sendGCode(Servo_right);
                 sendGCode(Z3_RightCheek_z2);
                 sendGCode(Z3_right2);
                 sendGCode(finish); 
                 sendGCode(Servo_Center);
                 sendGCode(Z_20);                  //back z20
//end
                //Zone1  Apple foundation on the nose.
                sendGCode(Z1_Nose_xy);            //zone1
                sendGCode(Z1_Nose_z)
                sendGCode(Z_20);                  //back z20
                //Round 1 (Zone4) Apple foundation on the left cheek.
                sendGCode(Z4_LeftCheek_xy1);       //zone4
                sendGCode(finish);
                sendGCode(Servo_left);
                sendGCode(Z4_LeftCheek_z1)
                sendGCode(Z4_left1);
                sendGCode(finish);
                sendGCode(Servo_Center);
                sendGCode(Z_20);                  //back z20
                //Round 2 (Zone4) Apple foundation on the left cheek. 
                sendGCode(Z4_LeftCheek_xy1);       //zone4
                sendGCode(finish);
                sendGCode(Servo_left);
                sendGCode(Z4_LeftCheek_z1)
                sendGCode(Z4_left1);
                sendGCode(finish);
                sendGCode(Servo_Center);
                sendGCode(Z_20);                  //back z20
                sendGCode(finish);
                sendGCode(Servo_Center);          //set servo

//add
                //Round 1 (Zone4) Apple foundation on the left cheek.
                sendGCode(Z4_LeftCheek_xy2);       //zone4
                sendGCode(finish);
                sendGCode(Servo_left);
                sendGCode(Z4_LeftCheek_z2)
                sendGCode(Z4_left2);
                sendGCode(finish);
                sendGCode(Servo_Center);
                sendGCode(Z_20);                  //back z20
                //Round 2 (Zone4) Apple foundation on the left cheek. 
                sendGCode(Z4_LeftCheek_xy2);       //zone4
                sendGCode(finish);
                sendGCode(Servo_left);
                sendGCode(Z4_LeftCheek_z2)
                sendGCode(Z4_left2);
                sendGCode(finish);
                sendGCode(Servo_Center);
                sendGCode(Z_20);                  //back z20
                sendGCode(finish);
                sendGCode(Servo_Center);          //set servo
//end

                //Zone5 Apple foundation on the chin. 
                sendGCode(Z5_Chin_xy);            //zone5
                sendGCode(Z5_Chin_z)
                sendGCode(Z5_right);
                sendGCode(Z5_left);
                sendGCode(Z5_left);
                sendGCode(Z5_right);
                sendGCode(Z_0);                   //z=0
                sendGCode(finish);
                sendGCode(Servo_Start); 
                sendGCode(Servo_Center);          //set servo
                sendGCode(HomeStart);             //home start
                sendGCode(L1_foundation_z);       //back Level 1
                sendGCode(magnetic_Close);        //magnetic close
                sendGCode(delay_1500); 
                sendGCode(Z_0);                   //z=0
  

            //------process 2 Apply blush--------------
                sendGCode(magnetic_Open);         //magnetic open
                sendGCode(L2_brush_y);            //Level2
                sendGCode(L2_brush_z);            //Level2
                sendGCode(Z_0);                   //z=0
                sendGCode(HomeCamera_x);          //home camera
                sendGCode(HomeCamera_y);          //home camera
                //Round 1
                sendGCode(Z3_RightCheek_xy1);      //zone3
                sendGCode(finish); 
                sendGCode(Servo_right);
                sendGCode(Z3_RightCheek_z_blush);
                sendGCode(Z3_right_blush);
                sendGCode(finish); 
                sendGCode(Servo_Center);
                sendGCode(Z_20);                  //back z20
                //Round 2
                sendGCode(Z3_RightCheek_xy1);      //zone3
                sendGCode(finish); 
                sendGCode(Servo_right);
                sendGCode(Z3_RightCheek_z_blush);
                sendGCode(Z3_right_blush);
                sendGCode(finish); 
                sendGCode(Servo_Center);
                sendGCode(Z_20);                  //back z20
                //Round 1
                sendGCode(Z4_LeftCheek_xy1);       //zone4
                sendGCode(finish);
                sendGCode(Servo_left);
                sendGCode(Z4_LeftCheek_z_blush)
                sendGCode(Z4_left_blush);
                sendGCode(finish);
                sendGCode(Servo_Center);
                sendGCode(Z_20);                  //back z20
                //Round 2
                sendGCode(Z4_LeftCheek_xy1);       //zone4
                sendGCode(finish);
                sendGCode(Servo_left);
                sendGCode(Z4_LeftCheek_z_blush)
                sendGCode(Z4_left_blush);
                sendGCode(Z_20);                  //back z20
                sendGCode(HomeCamera_x);          //home camera
                sendGCode(HomeCamera_y);          //home camera
                sendGCode(finish);
                sendGCode(Servo_Start); 
                sendGCode(Servo_Center);
                sendGCode(X_0);                   //x=0
                sendGCode(L2_brush_y);            //back Level2
                sendGCode(L2_brush_z);            //back Level2
                sendGCode(magnetic_Close);        //magnetic close
                sendGCode(delay_1500); 
                sendGCode(Z_0);                   //z=0
  

            //------process 3 Apply Lipstick-----------
                sendGCode(magnetic_Open);         //magnetic open
                sendGCode(L3_lips_y);             //Level3
                sendGCode(L3_lips_z);             //Level3
                sendGCode(Z_0);                   //z=0
                sendGCode(HomeCamera_x);          //home camera
                sendGCode(HomeCamera_y);          //home camera
                sendGCode(finish); 
                sendGCode(Z6_Mouth_xy);           //zone6
                sendGCode(Z6_Mouth_z);            //zone6
                sendGCode(delay_3000);           
                sendGCode(Z_0);                   //z=0
                sendGCode(finish);
                sendGCode(Servo_Start); 
                sendGCode(Servo_Center);
                sendGCode(X_0);                   //x=0
                sendGCode(L3_lips_y);             //back Level3
                sendGCode(L3_lips_z);             //back Level3
                sendGCode(magnetic_Close);        //magnetic Close
                sendGCode(delay_3000); 
                sendGCode(Z_0);                   //z=0
                sendGCode(HomeStart);             //back z

          },20);
        } else {
          res.status(404).send("Not found.");
        }
    });
});


parser.on('data', function (data) {
  console.log('data received: ' + data);
  // stop working when specific information is received.
  if (data.trim() === 'DONE') {
    // Run here when the command is finished.
    console.log('All tasks completed!');
    sp.close(); // close communication when finished.
  }
});

sp.on('open', function () {
  console.log('Communication is on!');
});

sp.on("error",function(){
  console.log("Communication error");
});

sp.on('drain', function () {
  console.log('Communication is Drain!');
});

sp.on('close', function () {
  console.log('Communication is Close!');
});

module.exports = router;
