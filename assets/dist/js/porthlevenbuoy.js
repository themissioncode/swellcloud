 


// we make these variables global so we know when they have loaded
      let surfheight, surfperiod;

      fetch(
        "https://data.channelcoast.org/observations/waves/latest?key='request key here"
      )
        .then(function (resp) {
          return resp.text();
        })
        .then(function (data) {
          //console.log(data);
          let parser = new DOMParser(),
            xmlDoc = parser.parseFromString(data, "text/xml");
          //console.log(xmlDoc.getElementsByTagName('ms:hs')[36].innerHTML); //76=Perran,36 Porthleven
          surfheight = xmlDoc.getElementsByTagName("ms:hs")[36].innerHTML;
          surfperiod = xmlDoc.getElementsByTagName("ms:tp")[36].innerHTML;

          // you can set the surf variable here, because the sketch will start only after the data loads,
          // also make sure to first convert it to a number like "Number(surfheight)" otherwise it won't work

          surfht = Number(surfheight);
          surfpd = Number(surfperiod);

          document.getElementById("surfheight").textContent = surfheight;
          document.getElementById("surfperiod").textContent = surfperiod;
        });

      var yoff = 0; // 2nd dimension of perlin noise

      var waveColor, waveColor2, waveColor3;
      var waveColorArr;
      var controls, waveSpeed;
      var canvas;

      let surfht;
      let surfpd;

      function setup() {
        canvas = createCanvas(windowWidth, windowHeight);

        waveColor = color(0, 50, 120, 100);
        waveColor2 = color(0, 100, 150, 100);
        waveColor3 = color(0, 200, 250, 100);
        noiseDetail(2, 0.2);

        waveColorArr = [waveColor, waveColor, waveColor2, waveColor2, waveColor3, waveColor3];
      }

      function draw() {
        // after these load, the sketch starts
        if (!surfperiod && !surfheight) {
          return;
        }
		  
		  

        background(0);
        noStroke();

        const amp = map(surfht, 0, 10, 0, 1);
        //const amp = map(surfpd, 0, 10, 0, 1);

        for (var i = 0; i <= 5; i++) {
          // We are going to draw a polygon out of the wave points
          beginShape();
          fill(waveColorArr[i]);
          var xoff = 0;

          for (var x = 0; x <= width + 500; x += 100) {
            var y = map(
              noise(xoff, yoff - 0.5 * i),
              0,
              1,
              (height / 1) * (i + 1),
              height - height / 1 + (height / 1) * i
            );
            vertex(x, y);

            // i've extracted this into a variable for cleaner code
            const inc = map(surfpd, 0, 20, 0.01, 0.5);
            xoff += inc + 0.5 / 10000.0;
          }

          vertex(width, height);
          vertex(0, height);
          endShape(CLOSE);
        }
		  

        const inc = map(surfht, 0, 10, 0, 0.025);
        yoff += 0.007 + inc + 0.5 / 10000.0;
      }

      function windowResized() {
        resizeCanvas(window.innerWidth, window.innerHeight);
		  
		  
      }

