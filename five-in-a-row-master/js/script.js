var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var logo = new Image();
logo.src = 'image/shuiyin.jpg';
 
//图片加载完成
logo.onload = function(){
    //绘制图片
    context.drawImage( logo, 0, 0, 450, 450);
    //绘制棋盘
    drawChessBoard();
 
}
 
 
//设置颜色
context.strokeStyle = '#AAA';
 
//绘制棋盘的方法
var drawChessBoard = function(){
    for(var i=0; i<15; i++ ){
        //丛线
        context.moveTo(15 + i*30, 15);
        context.lineTo(15 + i*30, 435);
        //横线
        context.moveTo(15, 15 + i*30);
        context.lineTo(435, 15 + i*30); 
        //执行绘制操作（描边）
        context.stroke();
    }  
}
 
//旗子绘制
var oneStep = function(i , j, me){
    context.beginPath();
    context.arc(15 + i*30, 15 + j*30, 13, 0, 2 * Math.PI);
    context.closePath();
    //渐变
    var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 - 2, 13, 15 + i*30 + 2, 15 + j*30 - 2, 0);
    if(me){
        gradient.addColorStop(0,'#000');
        gradient.addColorStop(1,'#666');
    }else{
        gradient.addColorStop(0,'#DDD');
        gradient.addColorStop(1,'#FFF');
    }
 
    //填充颜色设置
    context.fillStyle = gradient;
    //执行绘制操作（填充）
    context.fill();
}
//落子设置 默认黑旗 true 黑 false 白
var me = true;
//存储棋盘交叉点坐标（二维数组）
var chessBoard = [];
for(var i=0; i<15; i++){
    //第一维 数组
    chessBoard[i] = [];
    for(var j=0; j<15; j++){
        //坐标上存默认值 0
        chessBoard[i][j] = 0;
    }
}
 
//赢法数组 三维数组
var wins = [];
for(var i=0; i<15; i++){
    //第一维数组
    wins[i] = [];
    for(var j=0; j<15; j++){
        //第二维数组
        wins[i][j] = [];
    }
}
//赢法种类索引
var count = 0;
//15*15 纵向赢法 165 种
for(var i=0; i<15; i++){
    for(var j=0; j<11; j++){
        for(var k=0; k<5; k++){
            wins[i][j+k][count] = true;
        }
        count++;
    }
}
//15*15 横向赢法 165 种
for(var i=0; i<15; i++){
    for(var j=0; j<11; j++){
        for(var k=0; k<5; k++){
            wins[j+k][i][count] = true;
        }
        count++;
    }
}
//15*15  斜向赢法 121 种
for(var i=0; i<11; i++){
    for(var j=0; j<11; j++){
        for(var k=0; k<5; k++){
            wins[i+k][j+k][count] = true;
        }
        count++;
    }
}
//15*15  反斜向赢法 121 种
for(var i=0; i<11; i++){
    for(var j=14; j>3; j--){
        for(var k=0; k<5; k++){
            wins[i+k][j-k][count] = true;
        }
        count++;
    }
}
//console.dir(wins);
//document.title = count;
 
//人的赢法统计数组
var myWin = [];
//计算机的赢法统计数组
var computerWin = [];
//表示旗有没有结束
var over = false;
for(var i=0; i<count; i++){
    myWin[i] = 0;
    computerWin[i] = 0;
}
 
chess.onclick = function(e){
    //判断旗是否结束
    if(over){
        return;
    }
    //判断是否黑子下棋
    if(!me){
        return;
    }
    //事件兼容处理
    var e = e || event;
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    //如果该坐标没有落子才可以落子
    if(chessBoard[i][j]==0){
        oneStep(i, j, me);
 
        //如果落下的是黑子 在坐标存1
        chessBoard[i][j] = 1;
 
 
 
         
        //赢法统计
        for(var k=0; k<count; k++){
            if(wins[i][j][k]){
                myWin[k]++;
                //该赢法计算机不可能再赢了
                computerWin[k] = 6;
                //
                if(myWin[k] == 5){
                    window.alert("黑旗赢了");
                    over = true;
                }
            }
        }
 
        //如果赢法统计完成旗没有结束
        if(!over){
            computerAI();
            me = !me;
        }
    }
}
//计算机下旗
var computerAI = function(){
    //记录人下的旗子
    var myScore = [];
    //记录计算机下的旗子
    var computerScore = [];
    //保存最高分数
    var max = 0;
    //最高分数点坐标
    var maxX = 0,maxY = 0;
 
    for(var i=0; i<15; i++){
        myScore[i] = [];
        computerScore[i] = [];
        for(var j=0; j<15; j++){
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
 
    //遍历整个棋盘
    for(var i=0; i<15; i++){
        for(var j=0; j<15; j++){
            //该坐标可以落子
            if(chessBoard[i][j] == 0){
                //遍历所有赢法
                for(var k=0; k<count; k++){
                    //判断第K种赢法是否有价值
                    if(wins[i][j][k]){
                        //判断第K种赢发黑旗是否落子
                        //拦截价值判断
                        if(myWin[k] == 1){
                            //拦截
                            myScore[i][j] += 200;
                        }else if(myWin[k] == 2){
                            //拦截
                            myScore[i][j] += 400;                        
                        }else if(myWin[k] == 3){
                            //拦截
                            myScore[i][j] += 2000;                           
                        }else if(myWin[k] == 4){
                            //拦截
                            myScore[i][j] += 10000;                          
                        }
 
                        //计算机本身落子价值判断
                        if(computerWin[k] == 1){
                            //落子价值
                            computerScore[i][j] += 220;
                        }else if(computerWin[k] == 2){
                            //落子价值
                            computerScore[i][j] += 420;                          
                        }else if(computerWin[k] == 3){
                            //落子价值 
                            computerScore[i][j] += 2100;                         
                        }else if(computerWin[k] == 4){
                            //落子价值
                            computerScore[i][j] += 20000;                    
                        }
                    }
                }
 
                //存储最高分数
                if(myScore[i][j] > max){
                    max = myScore[i][j];
                    maxX = i;
                    maxY = j;
                }else if(myScore[i][j] == max){
                    if(computerScore[i][j] > computerScore[maxX][maxY]){
                        maxX = i;
                        maxY = j;
                    }
                }
 
                //存储最高分数
                if(computerScore[i][j] > max){
                    max = computerScore[i][j];
                    maxX = i;
                    maxY = j;
                }else if(computerScore[i][j] == max){
                    if(myScore[i][j] > myScore[maxX][maxY]){
                        maxX = i;
                        maxY = j;
                    }
                }
 
            }
        }
    }
    //计算机子
    oneStep(maxX, maxY, false);
    chessBoard[maxX][maxY] = 2;
    document.title = 'x'+maxX+' Y'+maxY;
    console.dir(chessBoard[maxX][maxY]);
    //赢法统计
    for(var k=0; k<count; k++){
        if(wins[maxX][maxY][k]){
            //白子赢法更近一步
            computerWin[k]++;
            //该赢法黑旗不可能再赢了
            myWin[k] = 6;
            //
            if(computerWin[k] == 5){
                window.alert("白旗赢了");
                over = true;
            }
        }
    }
 
    //如果赢法统计完成旗没有结束
    if(!over){
        me = !me;
    }
}