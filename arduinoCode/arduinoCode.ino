#define LED 7

void setup() {
  // setup serial 
  Serial.begin(9600);

  // init led pin 
  pinMode(LED, OUTPUT);
  digitalWrite(LED, LOW);
}

void loop() {
  // if you received serail reading
  if(Serial.available()> 0){
    char cmd = Serial.read();

    // check if it is o ; open the gate
    if(cmd == 'o'){
      // we simulate gate here with led connected to LED pin 
      // you can add any code here and it will run on auth logins     
      digitalWrite(LED, HIGH); 
    }
    else if( cmd == 'c'){
      // close gate 
      // put here any code to simulate closing gate
      digitalWrite(LED, LOW);
    }
    // feedback to the server
    // don't change it
    Serial.println(cmd);
  }
}