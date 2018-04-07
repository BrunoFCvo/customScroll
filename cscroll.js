function CustomScroll(target) {
	var SHIFT_KEY = 16;
	var shiftPressed = false;
	
	
	// DETECT BROWSER
	var NORMALIZER = 1;
	if(navigator.userAgent.match(/Chrome/i)) {
		NORMALIZER = 1;
	} else if(navigator.userAgent.match(/Firefox/i)) {
		NORMALIZER = (1/3)*100;
	}
	
	
	// ELEMENT POSITION
	var curY = 0;
	var curX = 0;
	
	
	// BAR VISIBILITY
	var vBarVisible = false;
	var hBarVisible = false;
	
	
	// BAR POSITIONS
	var vBarPos = 0;
	var hBarPos = 0;
	
	
	// ELEMENT SIZE
	var deltaHeight = 0;
	var clientHeight = 0;
	var scrollHeight = 0;
	
	var deltaWidth = 0;
	var clientWidth = 0;
	var scrollWidth = 0;
	
	
	// RAIL AND BAR SIZES
	var vRailSize = 0;
	var vBarSize = 0;
	var vDeltaSize = 0;
	
	var hRailSize = 0;
	var hBarSize = 0;
	
	
	// BAR MULTIPLIERS
	var vMultiplier = 0;
	var hMultiplier = 0;
	
	
	// SETUP ELEMENTS
	var scrollWrapper = target;
	var contentWrapper = target.querySelector(".cscroll_content");
	
	
	// CREATE RAILS
	var vRail = document.createElement("div");
	vRail.classList.add("cscroll_vrail");
	scrollWrapper.appendChild(vRail);
	
	var hRail = document.createElement("div");
	hRail.classList.add("cscroll_hrail");
	scrollWrapper.appendChild(hRail);
	
	
	// CREATE BARS AND ATTACH THEM TO THE RAILS
	var vBar = document.createElement("div");
	vBar.classList.add("cscroll_vbar");
	vRail.appendChild(vBar);
	
	var hBar = document.createElement("div");
	hBar.classList.add("cscroll_hbar");
	hRail.appendChild(hBar);
	
	
	// CREATE WHEEL EVENTS
	scrollWrapper.addEventListener("wheel", wheel);
	window.addEventListener("keyup", key_up);
	window.addEventListener("keydown", key_down);
	
	function wheel(e) {
		e.preventDefault();
		e.stopPropagation();
		
		let deltaX = -e.deltaX * NORMALIZER;
		let deltaY = -e.deltaY * NORMALIZER;
		
		if(shiftPressed) { deltaX = deltaY; deltaY = 0; }
		
		setContentPos(curX + deltaX, curY + deltaY);
	}
	
	function key_down(e) {
		if(e.keyCode == SHIFT_KEY) shiftPressed = true;
	}
	
	function key_up(e) {
		if(e.keyCode == SHIFT_KEY) shiftPressed = false;
	}
	
	function updateHeights() {
		if(clientHeight == scrollWrapper.clientHeight && 
			clientWidth == scrollWrapper.clientWidth) {
			return;
		}
		
		// VERTICAL SCROLL SIZES
		clientHeight 	= scrollWrapper.clientHeight;
		scrollHeight	= contentWrapper.clientHeight;
		deltaHeight		= scrollHeight - clientHeight;
		
		vBarVisible 	= scrollHeight > clientHeight;
		if(vBarVisible) {
			scrollWrapper.classList.add("vbar");
			
			setTimeout(function(){
				vRailSize 	= vRail.clientHeight;
				vBarSize 	= (clientHeight * vRailSize) / scrollHeight;
				vDeltaSize	= vRailSize - vBarSize;
				vMultiplier	= -vDeltaSize / deltaHeight;
				
				vBar.style.height 	= vBarSize + "px";
				vRail.style.display	= "";
			},0);
		} else {
			scrollWrapper.classList.remove("vbar");
			vRail.style.display	= "none";
		}
		
		
		// HORIZONTAL SCROLL SIZES
		clientWidth		= scrollWrapper.clientWidth;
		scrollWidth		= contentWrapper.clientWidth;
		deltaWidth		= scrollWidth - clientWidth;
		
		hBarVisible		= scrollWidth > clientWidth;
		if(hBarVisible) {
			scrollWrapper.classList.add("hbar");
			
			setTimeout(function() {
				hRailSize 	= hRail.clientWidth;
				hBarSize 	= (clientWidth * hRailSize) / scrollWidth;
				hDeltaSize	= hRailSize - hBarSize;
				hMultiplier = -hDeltaSize / deltaWidth;
				
				hRail.style.display	= "";
				hBar.style.width 	= hBarSize + "px";
			},0);
		} else {
			scrollWrapper.classList.remove("hbar");
			hRail.style.display	= "none";
		}
		
		setContentPos(curX, curY);
	}
	
	
	// CREATE BAR EVENTS
	let startX = 0;
	let startY = 0;
	
	
	// VERTICAL BAR DRAGGING
	let touchingVBar = false;
	if(document.documentMode || /Edge/.test(navigator.userAgent) || /MSIE/.test(navigator.userAgent)) {
		vBar.addEventListener("pointerdown", startVBar);
		window.addEventListener("pointermove", moveVBar);
		window.addEventListener("pointerup", endVBar);
	} else {
		vBar.addEventListener("mousedown", startVBar);
		window.addEventListener("mousemove", moveVBar);
		window.addEventListener("mouseup", endVBar);
		
		vBar.addEventListener("touchstart", startVBar);
		window.addEventListener("touchmove", moveVBar);
		window.addEventListener("touchend", endVBar);	
	}
	
	function startVBar(e) {
		e.stopPropagation();
		e.preventDefault();
		
		vBar.style.transition = "none";
		contentWrapper.style.transition = "none";
		
		let pageY = e.pageY || e.touches[0].pageY;
		
		touchingVBar = true;
		startY = pageY - vBarPos;
		return false;
	}
	
	function moveVBar(e) {
		if(!touchingVBar) return;
		
		let pageY = e.pageY || e.touches[0].pageY;
		setVBarPos(pageY - startY);
		
		return false;
	}
	
	function endVBar(e) {
		if(!touchingVBar) return;
		
		vBar.style.transition = "";
		contentWrapper.style.transition = "";
		
		touchingVBar = false;
		return false;
	}
	
	
	// HORIZONTAL BAR DRAGGING
	let touchingHBar = false;
	if(document.documentMode || /Edge/.test(navigator.userAgent) || /MSIE/.test(navigator.userAgent)) {
		hBar.addEventListener("pointerdown", startHBar);
		window.addEventListener("pointermove", moveHBar);
		window.addEventListener("pointerup", endHBar);
	} else {
		hBar.addEventListener("mousedown", startHBar);
		window.addEventListener("mousemove", moveHBar);
		window.addEventListener("mouseup", endHBar);
		
		hBar.addEventListener("touchstart", startHBar);
		window.addEventListener("touchmove", moveHBar);
		window.addEventListener("touchend", endHBar);	
	}
	
	function startHBar(e) {
		e.stopPropagation();
		e.preventDefault();
		
		hBar.style.transition = "none";
		contentWrapper.style.transition = "none";
		
		let pageX = e.pageX || e.touches[0].pageX;
		
		touchingHBar = true;
		startX = pageX - hBarPos;
		return false;
	}
	
	function moveHBar(e) {
		if(!touchingHBar) return;
		
		let pageX = e.pageX || e.touches[0].pageX;
		setHBarPos(pageX - startX);
		
		return false;
	}
	
	function endHBar(e) {
		if(!touchingHBar) return;
		
		hBar.style.transition = "";
		contentWrapper.style.transition = "";
		
		touchingHBar = false;
		return false;
	}
	
	
	// CONTENT DRAGGING
	let lastX = 0;
	let lastY = 0;
	
	let speedX = 0;
	let speedY = 0;
	
	let inertia = null;
	let friction = 0.95;
	let minSpeed = 0.5;
	
	let touchingContent = false;
	if(document.documentMode || /Edge/.test(navigator.userAgent) || /MSIE/.test(navigator.userAgent)) {
		contentWrapper.addEventListener("pointerdown", startContent);
		window.addEventListener("pointermove", moveContent);
		window.addEventListener("pointerup", endContent);
	} else {
		contentWrapper.addEventListener("mousedown", startContent);
		window.addEventListener("mousemove", moveContent);
		window.addEventListener("mouseup", endContent);
		
		contentWrapper.addEventListener("touchstart", startContent);
		window.addEventListener("touchmove", moveContent);
		window.addEventListener("touchend", endContent);	
	}
	
	function startContent(e) {
		e.stopPropagation();
		e.preventDefault();
		
		if(inertia) {
			clearInterval(inertia);
			inertia = null;
		}
		
		vBar.style.transition = "none";
		hBar.style.transition = "none";
		contentWrapper.style.transition = "none";
		
		let pageX = e.pageX || e.touches[0].pageX;
		let pageY = e.pageY || e.touches[0].pageY;
		
		touchingContent = true;
		speedX = 0;
		speedY = 0;
		
		startX = pageX - curX;
		startY = pageY - curY;

		lastX = pageX;
		lastY = pageY;
		return false;
	}
	
	function moveContent(e) {
		if(!touchingContent) return;
		
		let pageX = e.pageX || e.touches[0].pageX;
		let pageY = e.pageY || e.touches[0].pageY;
		
		setContentPos(pageX - startX, pageY - startY);
		
		speedX = pageX - lastX;
		speedY = pageY - lastY;
		
		lastX = pageX;
		lastY = pageY;
		return false;
	}
	
	function endContent(e) {
		if(!touchingContent) return;
		
		inertia = setInterval(function() {
			setContentPos(curX + speedX, curY + speedY);
			speedX = Math.abs(speedX) > minSpeed ? speedX * friction : 0;
			speedY = Math.abs(speedY) > minSpeed ? speedY * friction : 0;
			
			if(speedX == 0 && speedY == 0) {
				clearInterval(inertia);
				inertia = null;
				
				vBar.style.transition = "";
				hBar.style.transition = "";
				contentWrapper.style.transition = "";
			}
		}, 15);
		
		touchingContent = false;
		return false;
	}
	
	
	// AUX FUNCTIONS
	function setContentPos(x, y) {
		curX = x;
		curX = curX > 0 ? 0 : curX;
		curX = curX < -deltaWidth ? -deltaWidth : curX;
		hBarPos = curX * hMultiplier;
		hBar.style.transform = "translate3d("+hBarPos+"px,0,0)";
		
		curY = y;
		curY = curY > 0 ? 0 : curY;
		curY = curY < -deltaHeight ? -deltaHeight : curY;
		vBarPos = curY * vMultiplier;
		vBar.style.transform = "translate3d(0,"+vBarPos+"px,0)";
		
		contentWrapper.style.transform = "translate3d("+curX+"px,"+curY+"px,0)";
	}
	
	function setVBarPos(pos) {
		vBarPos = pos;
		vBarPos = vBarPos < 0 ? 0 : vBarPos;
		vBarPos = vBarPos > vDeltaSize ? vDeltaSize : vBarPos;
		vBar.style.transform = "translate3d(0,"+vBarPos+"px,0)";
		
		curY = vBarPos / vMultiplier;
		contentWrapper.style.transform = "translate3d("+curX+"px,"+curY+"px,0)";
	}
	
	function setHBarPos(pos) {
		hBarPos = pos;
		hBarPos = hBarPos < 0 ? 0 : hBarPos;
		hBarPos = hBarPos > hDeltaSize ? hDeltaSize : hBarPos;
		hBar.style.transform = "translate3d("+hBarPos+"px,0,0)";
		
		curX = hBarPos / hMultiplier;
		contentWrapper.style.transform = "translate3d("+curX+"px,"+curY+"px,0)";
	}
	
	// INIT
	setInterval(updateHeights, 100);
}
