//no data

var express = require('express');
var router = express.Router();
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
// Require the mysql package
const mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//USB COM
const sp = new SerialPort({ 
  path : "COM5", 
  baudRate: 250000,
});
const parser = sp.pipe(new ReadlineParser({ delimiter: '\r\n' }));

//------Home Start-------------------
var Home_x = 0;
var Home_y = 0;
var Home_z = 0;
var HomeStart = `G1 X${Home_x} Y${Home_y} Z${Home_z} F8000`;

//------Home Camera-----------------------
var HomeCamera_x = `G1 X-280 Z0 F8000`;
var HomeCamera_y = `G1 X-280 Y-90 Z0 F8000`;



// ********* cosmetics position **********
//-----level1 pick up foundation-----------
var L1_foundation_z = `G1 X0 Y-8.6 Z-17 F8000`;
//-----level2 pick up blush----------------
var L2_brush_y = `G1 X0 Y-78 Z0 F8000`
var L2_brush_z = `G1 X0 Y-78 Z-16 F8000`
//-----level3 pick up lipstick-------------
var L3_lips_y = `G1 X0 Y-156 Z0 F8000`
var L3_lips_z = `G1 X0 Y-156 Z-15.8 F8000`


// ***********Position Zone 1-6 ***************
//zone1
var Z1_Nose_xy = `G1 X-280 Y-60 F8000`;
var Z1_Nose_z = `G1 X-280 Y-60 Z-30 F8000`;
//zone2
var Z2_Forehead_xy = `G1 X-280 Y-130 F8000`;
var Z2_Forehead_z = `G1 X-280 Y-130 Z-28 F8000`;
var z2_r1 =  `G1 X-310 Z-29 F3000`;        //right
var z2_r2 =  `G1 X-370 Z-33 F3000`;        //right
var z2_l1 =  `G1 X-250 Z-29 F3000`;        //left
var z2_l2 =  `G1 X-190 Z-35 F3000`;        //left
//zone3 บน
var Z3_RightCheek_xy1 = `G1 X-330 Y-65 F8000`;
var Z3_RightCheek_z1 = `G1 X-330 Y-65 Z-33 F8000`;
var Z3_right1 =  `G1 X-380 Z-37 F3000`;  //right
//zone3 ล่าง
var Z3_RightCheek_xy2 = `G1 X-330 Y-65 F8000`;
var Z3_RightCheek_z2 = `G1 X-330 Y-45 Z-33 F8000`;
var Z3_right2 = `G1 X-380 Z-40 F3000`;
//zone4
var Z4_LeftCheek_xy1 = `G1 X-240 Y-65 F8000`;
var Z4_LeftCheek_z1 = `G1 X-240 Y-65 Z-33 F8000`;
var Z4_left1 =  `G1 X-190 Z-37 F3000`;  //left
//zone4
var Z4_LeftCheek_xy2 = `G1 X-240 Y-65 F8000`;
var Z4_LeftCheek_z2 = `G1 X-240 Y-45 Z-33 F8000`;
var Z4_left2 =  `G1 X-190 Z-40 F3000`;  //left
//zone5
var Z5_Chin_xy = `G1 X-280 Y-38 F8000`;
var Z5_Chin_z = `G1 X-280 Y-38 Z-33 F8000`;
var z5_r =  `G1 X-300 F3000`;
var z5_l =  `G1 X-260 F3000`;
//zone6
var Z6_Mouth_xy = `G1 X-280 Y-33 F8000`;
var Z6_Mouth_z = `G1 X-280 Y-33 Z-23 F8000`;

//back
var z_20 = `G1 Z-20 F8000`;
var z0 = `G1 Z0 F8000`;
var x0 = `G1 x0 F8000`;

//magnetic
var magnetic_Open =`M106`;
var magnetic_Close =`M107`;

//servo motor 0-170 (0 right user)//45
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

  // ***********put on makeup*************
  sendGCode(Servo_Start);           //set servo
  sendGCode(Servo_Center);           //set servo
  sendGCode(HomeStart);

  //------process 1 Apply foundation---------
  sendGCode(magnetic_Open);         //magnetic open
  sendGCode(L1_foundation_z);       //Level 1
  sendGCode(z0);                    //z=0
  sendGCode(HomeCamera_x);          //home camera
  sendGCode(HomeCamera_y);          //home camera
  sendGCode(finish);
  //1
  sendGCode(Z2_Forehead_xy);        //zone2
  sendGCode(Z2_Forehead_z);
  sendGCode(z2_r1);
  sendGCode(finish); 
  sendGCode(Servo_right);
  sendGCode(z2_r2);
  sendGCode(z2_r1);
  sendGCode(finish); 
  sendGCode(Servo_Center);
  sendGCode(z2_l1);
  sendGCode(finish); 
  sendGCode(Servo_left);
  sendGCode(z2_l2);
  sendGCode(z2_l1);
  sendGCode(finish); 
  sendGCode(Servo_Center);
  sendGCode(Z2_Forehead_z);
  sendGCode(Z2_Forehead_xy);  
  //2
  sendGCode(z2_r1);              //zone2
  sendGCode(finish); 
  sendGCode(Servo_right);
  sendGCode(z2_r2);
  sendGCode(z2_r1);
  sendGCode(finish); 
  sendGCode(Servo_Center);
  sendGCode(z2_l1);
  sendGCode(finish); 
  sendGCode(Servo_left);
  sendGCode(z2_l2);
  sendGCode(z2_l1);
  sendGCode(finish); 
  sendGCode(Servo_Center);
  sendGCode(Z2_Forehead_z);
  sendGCode(Z2_Forehead_xy);  
  sendGCode(z_20);                  //back z20

  //Round 1 (Zone3) Apple foundation on the right cheek.
  sendGCode(Z3_RightCheek_xy1);      //zone3
  sendGCode(finish); 
  sendGCode(Servo_right);
  sendGCode(Z3_RightCheek_z1);
  sendGCode(Z3_right1);
  sendGCode(finish); 
  sendGCode(Servo_Center);
  sendGCode(z_20);                  //back z20
  //Round 2 (Zone3) Apple foundation on the right cheek.
  sendGCode(Z3_RightCheek_xy1);      //zone3
  sendGCode(finish);
  sendGCode(Servo_right);
  sendGCode(Z3_RightCheek_z1);
  sendGCode(Z3_right1);
  sendGCode(finish);
  sendGCode(Servo_Center);
  sendGCode(z_20);                  //back z20

  //Round 1 (Zone3) Apple foundation on the right cheek.
  sendGCode(Z3_RightCheek_xy2);      //zone3
  sendGCode(finish);
  sendGCode(Servo_right);
  sendGCode(Z3_RightCheek_z2);
  sendGCode(Z3_right2);
  sendGCode(finish);
  sendGCode(Servo_Center);
  sendGCode(z_20);                  //back z20
  //Round 2 (Zone3) Apple foundation on the right cheek.
  sendGCode(Z3_RightCheek_xy2);      //zone3
  sendGCode(finish);
  sendGCode(Servo_right);
  sendGCode(Z3_RightCheek_z2);
  sendGCode(Z3_right2);
  sendGCode(finish);
  sendGCode(Servo_Center);
  sendGCode(z_20);                  //back z20

  sendGCode(Z1_Nose_xy);            //zone1
  sendGCode(Z1_Nose_z)
  sendGCode(z_20);                  //back z20

  //Round 1 (Zone4) Apple foundation on the left cheek.
  sendGCode(Z4_LeftCheek_xy1);       //zone4
  sendGCode(finish);
  sendGCode(Servo_left);
  sendGCode(Z4_LeftCheek_z1)
  sendGCode(Z4_left1);
  sendGCode(finish);
  sendGCode(Servo_Center);
  sendGCode(z_20);                  //back z20
  //Round 2 (Zone4) Apple foundation on the left cheek. 
  sendGCode(Z4_LeftCheek_xy1);       //zone4
  sendGCode(finish);
  sendGCode(Servo_left);
  sendGCode(Z4_LeftCheek_z1)
  sendGCode(Z4_left1);
  sendGCode(finish);
  sendGCode(Servo_Center);
  sendGCode(z_20);                  //back z20
  sendGCode(finish);
  sendGCode(Servo_Center);          //set servo

  //Round 1 (Zone4) Apple foundation on the left cheek.
  sendGCode(Z4_LeftCheek_xy2);       //zone4
  sendGCode(finish);
  sendGCode(Servo_left);
  sendGCode(Z4_LeftCheek_z2)
  sendGCode(Z4_left2);
  sendGCode(finish);
  sendGCode(Servo_Center);
  sendGCode(z_20);                  //back z20
  //Round 2 (Zone4) Apple foundation on the left cheek. 
  sendGCode(Z4_LeftCheek_xy2);       //zone4
  sendGCode(finish);
  sendGCode(Servo_left);
  sendGCode(Z4_LeftCheek_z2)
  sendGCode(Z4_left2);
  sendGCode(finish);
  sendGCode(Servo_Center);
  sendGCode(z_20);                  //back z20
  sendGCode(finish);
  sendGCode(Servo_Center);          //set servo

  sendGCode(finish);
  sendGCode(Servo_Center);           //set servo
  sendGCode(Z5_Chin_xy);            //zone5
  sendGCode(Z5_Chin_z)
  sendGCode(z5_r);
  sendGCode(z5_l);
  sendGCode(z5_l);
  sendGCode(z5_r);
  sendGCode(z0);                    //z=0
  sendGCode(finish);
  sendGCode(Servo_Start); 
  sendGCode(Servo_Center);           //set servo
  sendGCode(HomeStart);             //home start
  sendGCode(L1_foundation_z);       //back Level 1
  sendGCode(magnetic_Close);        //magnetic close
  sendGCode(delay_1500); 
  sendGCode(z0);                    //z=0
  

 //------process 2 Apply blush--------------
  sendGCode(magnetic_Open);         //magnetic open
  sendGCode(L2_brush_y);            //Level2
  sendGCode(L2_brush_z);            //Level2
  sendGCode(z0);                    //z=0
  sendGCode(HomeCamera_x);          //home camera
  sendGCode(HomeCamera_y);          //home camera
  //1
  sendGCode(Z3_RightCheek_xy1);      //zone3
  sendGCode(finish); 
  sendGCode(Servo_right);
  sendGCode(Z3_RightCheek_z1);
  sendGCode(Z3_right1);
  sendGCode(finish); 
  sendGCode(Servo_Center);
  sendGCode(z_20);                  //back z20
  //2
  sendGCode(Z3_RightCheek_xy1);      //zone3
  sendGCode(finish); 
  sendGCode(Servo_right);
  sendGCode(Z3_RightCheek_z1);
  sendGCode(Z3_right1);
  sendGCode(finish); 
  sendGCode(Servo_Center);
  sendGCode(z_20);                  //back z20
  //1
  sendGCode(Z4_LeftCheek_xy1);       //zone4
  sendGCode(finish);
  sendGCode(Servo_left);
  sendGCode(Z4_LeftCheek_z1)
  sendGCode(Z4_left1);
  sendGCode(finish);
  sendGCode(Servo_Center);
  sendGCode(z_20);                  //back z20
  //2  
  sendGCode(Z4_LeftCheek_xy1);       //zone4
  sendGCode(finish);
  sendGCode(Servo_left);
  sendGCode(Z4_LeftCheek_z1)
  sendGCode(Z4_left1);
  sendGCode(z_20);                  //back z20
  sendGCode(HomeCamera_x);          //home camera
  sendGCode(HomeCamera_y);          //home camera
  sendGCode(finish);
  sendGCode(Servo_Start); 
  sendGCode(Servo_Center);
  sendGCode(x0);                   //x=0
  sendGCode(L2_brush_y);            //back Level2
  sendGCode(L2_brush_z);            //back Level2
  sendGCode(magnetic_Close);        //magnetic close
  sendGCode(delay_1500); 
  sendGCode(z0);                    //z=0
  
  //------process 3 Apply Lipstick-----------
  sendGCode(magnetic_Open);         //magnetic open
  sendGCode(L3_lips_y);             //Level3
  sendGCode(L3_lips_z);             //Level3
  sendGCode(z0);                    //z=0
  sendGCode(HomeCamera_x);          //home camera
  sendGCode(HomeCamera_y);          //home camera
  sendGCode(finish); 
  sendGCode(Z6_Mouth_xy);           //zone6
  sendGCode(Z6_Mouth_z);            //zone6
  sendGCode(delay_3000);           
  sendGCode(z0);                    //z=0
  sendGCode(finish);
  sendGCode(Servo_Start); 
  sendGCode(Servo_Center);
  sendGCode(x0);                    //x=0
  sendGCode(L3_lips_y);             //back Level3
  sendGCode(L3_lips_z);             //back Level3
  sendGCode(magnetic_Close);        //magnetic Close
  sendGCode(delay_3000); 
  sendGCode(z0);                    //z=0
  sendGCode(HomeStart);             //back z

}, 20);

parser.on('data', function (data) {
  console.log('data received: ' + data);
  // เพิ่มเงื่อนไขเพื่อหยุดการทำงานเมื่อได้รับข้อมูลเฉพาะ
  if (data.trim() === 'DONE') {
    // ให้ทำงานที่นี่เมื่อได้รับคำสั่งเสร็จสิ้น
    console.log('All tasks completed!');
    sp.close(); // ปิดการสื่อสารเมื่อเสร็จสิ้น
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
