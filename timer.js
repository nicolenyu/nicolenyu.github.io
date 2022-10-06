class Timer{
	constructor(life){
		this.x = random(50, width-50);
		this.y = random(50, height-50);
		this.life = life;
		this.begin = millis();
		this.lifeLeft = life;
	}

	update(){
		let timeLapsed = millis() - this.begin;
		this.lifeLeft = this.life - timeLapsed;
		if(this.lifeLeft>0){
			return true;
		} 
		return false;
	}

	display(){
		//draw ellipse
		fill(255, 0, 0);
		stroke(255);
		strokeWeight(3);
		ellipse(this.x, this.y, 50, 50);
		//draw countdown
		noStroke();
		fill(255);
		textAlign(CENTER, CENTER);
		textSize(20);
		text(nf(this.lifeLeft/1000, 1, 1), this.x, this.y);
	}
	checkTouch(mx, my){
		if(dist(mx, my, this.x, this.y)<25){
			return int(this.lifeLeft/1000);
		}
		return -1;
	}
}