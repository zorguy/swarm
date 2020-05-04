class Boid{
  constructor(){
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D(); //vecteurs random pour qu'ils ne partent pas tous dans la même direction
    this.velocity.setMag(random(0.5, 1.5)); //intensité des vecteurs random pour qu'ils ne partent pas à la même vitesse
    this.acceleration = createVector();
    this.maxForce = 0.4;
    this.perception = 100; //portée de la vision du boid
    this.maxSpeed = 4;
  }
  
  edges(){
    if(this.position.x > width){
      this.position.x = 0;
    } else if(this.position.x < 0){
      this.position.x = width;
    }
    if(this.position.y > height){
      this.position.y = 0;
    } else if(this.position.y < 0){
      this.position.y = height;
    }
      
  }
  
  align(boids){
    
    let steering = createVector(); 
    let inSight = 0;
    for(let other of boids){
      let d = dist(this.position.x,
                   this.position.y,
                   other.position.x,
                   other.position.y);
      if(other!= this && d < this.perception){
        inSight++;
        steering.add(other.velocity);
      }
    }
    if(inSight>0){
      steering.div(inSight);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering
  }
  
  flock(boids){
    this.acceleration.mult(0);
    let alignment = this.align(boids);
    let cohesion = this.coheer(boids);
    let separation = this.separate(boids);
    
    separation.mult(separationSlider.value());
    cohesion.mult(cohesionSlider.value());
    alignment.mult(alignSlider.value());
    
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }
  
  separate(boids){
    let steering = createVector(); 
    let inSight = 0;
    for(let other of boids){
      let d = dist(this.position.x,
                   this.position.y,
                   other.position.x,
                   other.position.y);
      if(other!= this && d < this.perception){
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d);
        inSight++;
        steering.add(diff);
      }
    }
    if(inSight>0){
      steering.div(inSight);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering
  }
  
  coheer(boids){
    let steering = createVector(); 
    let inSight = 0;
    for(let other of boids){
      let d = dist(this.position.x,
                   this.position.y,
                   other.position.x,
                   other.position.y);
      if(other!= this && d < this.perception){
        inSight++;
        steering.add(other.position);
      }
    }
    if(inSight>0){
      steering.div(inSight);
      steering.sub(this.position);
      steering.limit(this.maxForce);
    }
    return steering;
  }
  
  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
  }
  
  show(){
    strokeWeight(8);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}