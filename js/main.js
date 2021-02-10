// 메인 페이지 JS - main.js //

$(function () { /////// jQB ///////////////////////
	//console.log("로딩완료!");

	////////// 전역변수 //////////
	// 1. 페이지번호
	var pno = -1;
	// 2. 전체 페이지수
	const totnum = 5;
	// const는 변수 var와 달리 변경불가한 상수를 말한다
	// 3. 광스크롤방지
	var psts = 0; //(0-허용, 1-불허용)


	/*[ 자동스크롤 구현 ]
	1. 기능 : 스크롤 휠을 위나 아래로 작동 시킬때 페이지 스크롤이 위나 아래로 자동으로 이동되는 애니메이션 기능
	2. 마우스 휠을 움직일때 발생하는 이벤트는?
	    (1) mousewheel : 초기버전부터 사용한 마우스 휠 이벤트
	    (2) wheel : thml5 버전 이후에 나온 마우스 휠 이벤트(아직 벤더사에서 표준화가 되지 못함 - ie, 사파리 지원x)
	    (3) DOMMouseScroll : 파이어폭스 전용 이벤트
	→ 결론적으로 mousewheel과 DOMMouseScroll을 동시에 사용함
	3. 마우스 휠 이벤트와 함수를 연결하는 방법은?
	    (1) bind(이벤트명,함수) : 최신버전에서 사용안됨
	    (2) on(이벤트명,함수) : 각종 이벤트와 함수를 연결해 사용함
	4. 마우스 휠 이벤트 발생시 기본 스크롤 이동 막는 방법은?
	    (1) html,body에 overflow:hidden 설정으로 스크롤막기
	    - 자동스크롤 페이지 이동은 보통 스크롤바를 없앤다
	    (2) 마우스 휠 이벤트가 걸린 코드에 preventDefault로 기본 이동기능 막기
	    (주의사항 - window,document,body와 같이 브라우저 최상위 객체나 요소에 본 막기기능은 사용하지 못하도록 변경되었음
	    ＊우회방법은 body를 overflow:hidden처리하고 속박스를 만들어서 스크롤 가능 상태로 두어 이것을 이벤트 대상으로 삼아서 스크롤 막기를 한다)*/
	var pgpos=[];
	var page_index=$(".page").index();
	$(".page").each(function(page_index,ele){
		pgpos[page_index]=$(".page").eq(page_index).offset().top;
		console.log("이거"+page_index+"/"+pgpos[page_index]);
	})
	
	
	// 여러가지 이벤트는 띄어쓰기로 나열함(동시적용 가능)
	$(document).on("mousewheel DOMMouseScroll",
		function (e) {
			////// 광스크롤 막기 //////
			if (psts === 1) return true;
			psts = 1;
			setTimeout(function () {
				psts = 0;
			}, 600); //타임아웃
			// return true는 마우스 휠 기능을 그대로 두고 돌아감
			// return false는 마우스 휠 기능을 정지 시키게 되는데 이것을 브라우저가 window,document,body에 대해서 금지하기 때문에 여기서는 return true를 해야한다.
			// 1. 이벤트 발생 확인
			//console.log("휠");
			// 기본 이동기능 막기는 하지 않음(body에 overflow:hidden)
			// e.preventDefault();
			// 2. 마우스 휠에서 가장 중요한 개념
			/*wheelDelta란?
			- ie, chrome용(opera는 detail을 사용함)
			- 마우스휠 이벤트가 발생함에 따라 이벤트 횟수 및 방향과 이동거리 등을 리턴해주는 내부 속성
			- 스크롤될 경우 방향과 이동거리를 알 수 있음(+는 윗방향, -는 아랫방향)*/
			e = window.event || e;
			// 전달되는 이벤트 값이 그대로 쓰거나 없다면 window.event값을 사용할 수 있도록 처리함
			// 변수 = 전달변수1 || 전달변수2
			// 해석 : 뒤의 두변수 중 true(유효한 것)인 것이 할당됨
			var delta = e.detail ? e.detail : e.wheelDelta;
			// 변수 = 조건연산자 → 조건연산자의 결과가 할당됨
			// 파이어폭스 브라우저일 경우 방향 부호를 반대로하기
			//console.log("현재브라우저" + navigator.userAgent);
			// navigator.userAgent는 브라우저별 세부정보를 보여주는 속성
			// 파이어폭스 브라우저는 "Firefox"라는 문자가 포함되고 이것으로 브라우저를 구분함
			// test(문자열) JS내장함수로 이것을 구분한다
			// 정규표현식.test(문자열) → 문자열에 정규표현식 문자가 있으면 true, 없으면 false를 리턴함
		
			if (/Firefox/i.test(navigator.userAgent)) {
				console.log("난파폭");
				delta = -delta; //부호를 반대로
			} //if문
			console.log("델타값:" + delta);
			// 3. 마우스휠 방향에 따라 페이지번호 증감
			// 음수일때 아랫방향
			if (delta < 0) {
				pno++; //1씩 증가
				if (pno === totnum) pno = totnum-1;
			} //if
			// 양수일때 윗방향
			else {
				pno--; //1씩 감소
				// 한계 페이지 번호 첫번호에 고정
				if (pno <= -1) pno = 0;
			} //else
			console.log("페이지번호:" + pno);

			// 4. 해당순번 페이지 높이값 구하기(top값)
			//var pgpos = $(".page").eq(pno).offset().top;
			
			//console.log("이동 페이지 위치:" + pgpos);
			// 5. 페이지 이동 애니메이션
			$(".wrap").stop().animate({
				scrollTop: pgpos[pno] + "px"
			}, 600, "easeInOutQuart",function(){
				
			});
			//beforeLoad();

		}); //mousewheel

          // GNB a링크를 클릭하면 해당 페이지 위치로 이동 애니메이션
	            // 이벤트 대상 : #gnb a
	            $(".lnb a").click(function(e) {
	                // 1. a태그 기본이동 막기
	                e.preventDefault();
	                // 클릭된 순번 알아오기
	                var idx = $(this).parent().index();
	                console.log("클릭된 순번:" + idx);
	                // 2. a태그의 href값 읽어오기(이동할 페이지 아이디값)
	                //var pid = $(this).attr("href");
	                //console.log("아이디:" + pid);
	                // 전역 페이지번호에 idx 일치시키기
	                pno = idx; //메뉴변경 함수를 위해 전역변수에 일치
	                // 3. 이동할 페이지 아이디로 페이지 위치값(top값)구하기
	                // offset() 메서드로 현재 요소 위치, 크기 정보를 알 수 있다
	                //var pgpos =  $(".page").eq(pno+1).offset().top;
	                //console.log("top값:" + pgpos);
	                // 4. 스크롤 이동 애니메이션
	                // 대상 : html,body (범용브라우저 코딩시 선택대상)
	                // 사용속성 : scrollTop (세로스크롤바 위치속성)
	                // 비교 - scrollLeft (가로스크롤바 위치속성)
	                $(".wrap").animate({
	                    scrollTop: pgpos[pno] + "px"
	                }, 800, "easeInOutQuart", function() {
	                    //afterLoad();
	                });
	                //beforeLoad();
	                // 5. 이동선택된 메뉴변경하기(class="on"넣기)
					$("this").eq(pno).parent()// 선택된 a요소의 부모 li를 선택
                    .addClass("on")// 클래스 "on" 넣기
                    .siblings()// 선택된 li외의 다른 li 모두 선택
                    .removeClass("on");// 모두 클래스 "on"지우기
                	
	                // beforeLoad();
	                
	            }); //click
	            // 페이지 액션 대상요소 초기화 함수호출
	            
	            // afterLoad함수 최초호출(첫페이지를 위해)
	            //setTimeout(afterLoad, 1000); // = setTimeout("afterLoad()",1000);
	            // setTimeout 또는 setInterval 함수에서 함수명은 전달값이 없을 경우 함수 이름만 쓸 수 있다. 
	        
	        
	         




/********************도형모음**********************/




	// 넣을대상
	var obj1 = $(".polygon_empty");
	// 대상개수
	var setNum = obj1.length;
	// 대상순번
	var cntSet = 0;
	//console.log("개수:" + setNum);

	// 개수만큼 무빙 class넣기 (.mvo)

	var setMvo = function () {

		obj1.eq(cntSet).addClass("mvo");

		if (cntSet < setNum) {
			cntSet++; //순번1증가
			// 0.5초후 다음것 호출셋팅!
			setTimeout(setMvo, 500);
		} //// if문 ////////////////


	}; ///////// setMvo 함수 //////////

	// 처음에 한번 호출!
	setMvo();

    
    /*모바일 메뉴 누르면***************************/
    var m_nav = $(".m_nav_wrap");
    /*기본적으로 안보여야함. 모바일일때 메뉴눌러야 보여야함*/
    m_nav.hide();
    $(".m_menubtn").click(function(){
        m_nav.show();
    });
    $(".m_nav_close, .m_nav_list li").click(function(){
        m_nav.hide();
    });

	/**********************더보기창**********************/

	/// more버튼 클릭시 설명 나오고 스크롤 없애기
	$(".know_more").click(function () {

		$(".ceo_text").animate({
			left: "50%"
		}, 400);
		$(".wrap").css({
			overflow: "hidden"
		});


	}); //////// click /////////////////



	/// more버튼 클릭시 설명 나오고 스크롤 없애기
	$(".ceo_text").click(function () {

		$(".ceo_text").animate({
			left: "100%"
		}, 400);
		$(".wrap").css({
			overflow: "hidden"
		});


	}); //////// click /////////////////




	/**********************스크롤**********************/


	$(".clothes_box li div").click(function () {

		var bgi = $(this).css("background-image");
		bgi = bgi.split("/");
		bgi = bgi[bgi.length - 1].replace('")', '');
		//alert(bgi);


		//변경이미지
		$(".show_img img").attr("src", "images/" + bgi);

	}); ////////// click //////////////////


	// 드래그 대상 : #bar
	$(".scrollmove").draggable({
		axis: "y", // x축고정
		containment: "parent" // 드래그 범위를 부모로 한정
	});
	/* 바가 이동할때 큰 이미지를 이동시키려면 비례식을 세워서 큰 이미지의 이동값을 구한다
	 바의 최대 이동값 : 바 이동값 = 이미지 최대 이동값 : 이미지 이동값
	 바최 : 바이 = 이최 : 이이
	 알고 싶은 값? 이이
	 이이 = 바이*이최/바최
	*/
	// 위치값 설정변수
	var barmax = 570; // 바의 최대 이동값(바최)
	var barpos; // 바의 이동값(바이)
	var imgmax = 400; // 이미지의 최대 이동값(이최)
	var imgpos; // 이미지 이동값(이이)
	// 바를 드래그 할때 이벤트와 함수를 연결함
	// on(이벤트명,함수)
	// drag : 드래그 이벤트
	$(".scrollmove").on("drag", function () {
		// 현재 바의 이동값
		barpos = $(this).position().top;
		// offset().left는 화면 왼쪽기준인 값이다
		// position().left는 부모요소 기준 위치값(부모가 반드시 static이 아니여야함!)
		// #bar의 부모를 relative로 만들어야함!
		console.log("바이:" + barpos);
		// 구할식 : 이이 = 바이*이최/바최
		imgpos = barpos * imgmax / barmax;
		// 이동적용하기 대상 : #content
		$(".clothes_box").css({
			top: -imgpos + "px"
		}); //css
	}); // drag



	
	
	
	
	
	
	

	
	
	
	
	/**********************슬라이드**********************/

	// 버튼클릭시 이동
	$(".btnnext").click(function () {
		$(".p1 ul").animate({
			left: "-100%"
		}, 400, function () {
			$(this).append($("li", this).first())
				.css({
					left: "0"
				}); /*어펜드로 만들어내서 차곡차곡쌓이게된다.*/
		});
	}); //////// click ///////////////

	// 버튼클릭시 이동
	$(".btnprev").click(function () {
		$(".p1.p1_top").find("ul").css({
			left: "-100%"
		});
		$(".p1.p1_bottom").find("ul").css({
			left: "-100%"
		});
		$(".p1.p1_top").find("ul").prepend($(".p1.p1_top").find("ul").find("li").last()).animate({
			left: "0%"
		}, 400);
		$(".p1.p1_bottom").find("ul").prepend($(".p1.p1_bottom").find("ul").find("li").last()).animate({
			left: "0%"
		}, 400);

	}); //////// click ///////////////




	// 텍스트 넘기기
	$(".btnnext").click(function () {
		$(".store_text1 ul").animate({
			left: "-100%"
		}, 400, function () {
			$(this).append($("li", this).first())
				.css({
					left: "0"
				});
		});
		$(".store_text2 ul").animate({
			left: "-100%"
		}, 400, function () {
			$(this).append($("li", this).first())
				.css({
					left: "0"
				});
		});
	}); //////// click ///////////////

	$(".btnprev").click(function () {
		$(".store_text1 ul").animate({
			left: "-100%"
		}, 400, function () {
			$(this).append($("li", this).first())
				.css({
					left: "0"
				});
		});
		$(".store_text2 ul").animate({
			left: "-100%"
		}, 400, function () {
			$(this).append($("li", this).first())
				.css({
					left: "0"
				});
		});
	}); //////// click ///////////////

	/*************************유튜브***************************/

	$(".burst_text").click(function () {
		$(".video_wrap").animate({
			width: "100%",
			height: "100%"
		}, 500);
	}); ////// click /////////////
	$(".close_btn").click(function () {
		$(".video_wrap").animate({
			width: "0%",
			height: "0%"
		}, 500);
	}) /// click/////////////

	$(".linkpage_ceo a").click(function () {
		$(".popup").toggleClass("on");
	}); ////click/////////
	
	
	
	/* 콜라보박스 드래그이동 */
	/*new Dragdealer('move');*/
	
	/* sns 호버시 아이콘 바뀌기 */
	$(".sns_facebook a").hover(function(){/*들어갈때*/
		$(this).find("img").attr("src","images/social_icon_f_hover.png");
	}, function(){/*나갈 때*/
		$(this).find("img").attr("src","images/social_icon_f.png");
	});
	$(".sns_insta a").hover(function(){/*들어갈때*/
		$(this).find("img").attr("src","images/social_icon_i_hover.png");
	}, function(){/*나갈 때*/
		$(this).find("img").attr("src","images/social_icon_i.png");
	});

	$(".sns_twitter a").hover(function(){/*들어갈때*/
		$(this).find("img").attr("src","images/social_icon_t_hover.png");
	}, function(){/*나갈 때*/
		$(this).find("img").attr("src","images/social_icon_t.png");
	});

	$(".sns_youtube a").hover(function(){/*들어갈때*/
		$(this).find("img").attr("src","images/social_icon_y_hover.png");
	}, function(){/*나갈 때*/
		$(this).find("img").attr("src","images/social_icon_y.png");
	});
    
    
    var swiper1 = new Swiper('.swiper-container1', {
      slidesPerView: 4,
      spaceBetween: 0,
    });
    
    
    var swiper2 = new Swiper('.swiper-container2', {
      slidesPerView: 4,
      spaceBetween: 0,
    });
    
    
    var swiper3 = new Swiper('.swiper-container3', {
      slidesPerView: 4,
      spaceBetween: 0,
    });
    
    $(".btn_movR").click(function(){
//        alert(444)
        $(".moveBox").animate({left:"-100%"},600,function(){
            $(this).append($(">div",this).first()).css({left:"0"});
        });
        
        
        $(".colabo_box_t p").animate({left:"-100%"},600,function(){
            $(this).append($(">span",this).first()).css({left:"0"});
        });
    });/////////// click //////////////////////////
    
    
    
    
    $(".btn_movL").click(function(){
//        alert(444)
         $(".moveBox").prepend($(".moveBox>div").last()).css({left:"-100%"});
        $(".moveBox").animate({left:"0%"},600);
        
        
        $(".colabo_box_t p").prepend($(".colabo_box_t p>span").last()).css({left:"-100%"});
        $(".colabo_box_t p").animate({left:"0%"},600);
    });/////////// click //////////////////////////
    
    

}); ////////// jQB ///////////////////////////////
/////////////////////////////////////////////////
