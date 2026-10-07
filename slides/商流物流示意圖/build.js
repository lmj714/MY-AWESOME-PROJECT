const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "商流與物流示意圖";
pres.theme = { headFontFace: "Microsoft JhengHei", bodyFontFace: "Microsoft JhengHei" };
const F = "Microsoft JhengHei";
const LON0=98, LON1=130, LAT0=18.5, LAT1=34.7, W=13.333, H=7.5;
const P = (lon, lat) => ({ x: (lon-LON0)/(LON1-LON0)*W, y: (LAT1-lat)/(LAT1-LAT0)*H });
const BLUE="1D4E89", ORANGE="E07A1F", INK="1F2933", MUTED="5B6770";

const s = pres.addSlide();
s.background = { path: "map_bg.png" };

// map labels
const lbl = (t,x,y,w=1.6) => s.addText(t,{x,y,w,h:0.35,fontFace:F,fontSize:12,color:"8FA3B3",italic:true,charSpacing:4,isTextBox:true,margin:0,objectName:"地圖標籤 "+t});
lbl("東 海",10.6,3.3); lbl("南 海",8.0,6.85);

// title
s.addText("商流 / 物流示意圖",{x:0.5,y:0.35,w:7,h:0.7,fontFace:F,fontSize:32,bold:true,color:INK,margin:0,isTextBox:true,objectName:"標題"});
s.addText("立訊精密（義安）× 香港立訊（A2100）× 宣德智能（高雄）",{x:0.5,y:1.05,w:7,h:0.4,fontFace:F,fontSize:14,color:MUTED,margin:0,isTextBox:true,objectName:"副標題"});

// legend / steps panel
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.5,y:1.75,w:4.3,h:2.75,rectRadius:0.12,fill:{color:"FFFFFF",transparency:8},line:{color:"D5DEE5",width:0.75},shadow:{type:"outer",color:"000000",opacity:0.12,blur:6,offset:2,angle:90},objectName:"圖例底框"});
s.addShape(pres.shapes.LINE,{x:0.75,y:2.17,w:0.7,h:0,line:{color:BLUE,width:2.5,dashType:"dash",endArrowType:"triangle"},objectName:"圖例 商流"});
s.addText([{text:"商流",options:{bold:true,color:BLUE}},{text:"（PO 下單）",options:{color:MUTED}}],{x:1.6,y:1.97,w:3,h:0.4,fontFace:F,fontSize:14,margin:0,isTextBox:true,objectName:"圖例文字 商流"});
s.addShape(pres.shapes.LINE,{x:0.75,y:2.62,w:0.7,h:0,line:{color:ORANGE,width:3,endArrowType:"triangle"},objectName:"圖例 物流"});
s.addText([{text:"物流",options:{bold:true,color:ORANGE}},{text:"（實體出貨）",options:{color:MUTED}}],{x:1.6,y:2.42,w:3,h:0.4,fontFace:F,fontSize:14,margin:0,isTextBox:true,objectName:"圖例文字 物流"});
const steps = [
  ["①", BLUE, "義安(3110) 下 PO 給 香港立訊(A2100)"],
  ["②", BLUE, "香港立訊(A2100) 下 PO 給 宣德智能(2207)"],
  ["③", ORANGE, "宣德智能(高雄) 直接出貨至 義安(2610)"],
];
steps.forEach(([n,c,t],i)=>{
  const y = 3.0 + i*0.45;
  s.addShape(pres.shapes.OVAL,{x:0.75,y:y+0.03,w:0.3,h:0.3,fill:{color:c},line:{color:c},objectName:"步驟圓 "+(i+1)});
  s.addText(n.replace(/[①②③]/,String(i+1)),{x:0.75,y:y+0.03,w:0.3,h:0.3,fontFace:F,fontSize:11,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0,isTextBox:true,objectName:"步驟號 "+(i+1)});
  s.addText(t,{x:1.2,y,w:3.55,h:0.36,fontFace:F,fontSize:12,color:INK,valign:"middle",margin:0,isTextBox:true,objectName:"步驟 "+(i+1)});
});

// nodes
const T=P(117.81,30.93), HK=P(114.17,22.30), KH=P(120.30,22.62);
const dot=(p,c,name)=>{
  s.addShape(pres.shapes.OVAL,{x:p.x-0.16,y:p.y-0.16,w:0.32,h:0.32,fill:{color:c,transparency:70},line:{color:c,width:0},objectName:name+" 光暈"});
  s.addShape(pres.shapes.OVAL,{x:p.x-0.08,y:p.y-0.08,w:0.16,h:0.16,fill:{color:c},line:{color:"FFFFFF",width:1.5},objectName:name+" 位置點"});
};

// arrow from a to b, shortened at both ends
const arrow=(a,b,opt,name,trim=0.22)=>{
  const dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L;
  const A={x:a.x+ux*trim,y:a.y+uy*trim}, B={x:b.x-ux*trim,y:b.y-uy*trim};
  s.addShape(pres.shapes.LINE,{x:Math.min(A.x,B.x),y:Math.min(A.y,B.y),w:Math.abs(B.x-A.x),h:Math.abs(B.y-A.y),
    flipH:B.x<A.x, flipV:B.y<A.y, line:Object.assign({endArrowType:"triangle"},opt),objectName:name});
};
const pill=(t,cx,cy,c,name)=>{
  s.addText(t,{x:cx-0.6,y:cy-0.19,w:1.2,h:0.38,shape:pres.shapes.ROUNDED_RECTANGLE,rectRadius:0.19,fill:{color:c},line:{color:"FFFFFF",width:1.25},
    fontFace:F,fontSize:12,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0,isTextBox:true,objectName:name});
};
arrow(T,HK,{color:BLUE,width:2.5,dashType:"dash"},"商流① 義安→香港");
arrow(HK,KH,{color:BLUE,width:2.5,dashType:"dash"},"商流② 香港→高雄");
arrow(KH,T,{color:ORANGE,width:3.5},"物流③ 高雄→義安");
pill("① PO",(T.x+HK.x)/2-0.15,(T.y+HK.y)/2,BLUE,"標籤 商流①");
pill("② PO",(HK.x+KH.x)/2,(HK.y+KH.y)/2+0.32,BLUE,"標籤 商流②");
pill("③ 出貨",(KH.x+T.x)/2+0.2,(KH.y+T.y)/2,ORANGE,"標籤 物流③");
dot(T,"C0392B","義安"); dot(HK,BLUE,"香港"); dot(KH,"C0392B","高雄");

// cards
const card=(x,y,w,role,roleC,name,code,plant,loc,obj)=>{
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y,w,h:1.62,rectRadius:0.1,fill:{color:"FFFFFF"},line:{color:"D5DEE5",width:0.75},
    shadow:{type:"outer",color:"000000",opacity:0.15,blur:8,offset:2,angle:90},objectName:obj+" 卡片"});
  s.addText(role,{x:x+w-1.25,y:y+1.22,w:1.1,h:0.28,shape:pres.shapes.ROUNDED_RECTANGLE,rectRadius:0.14,fill:{color:roleC},
    fontFace:F,fontSize:10,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0,isTextBox:true,objectName:obj+" 角色"});
  s.addText([
    {text:loc,options:{fontSize:10,color:MUTED,breakLine:true}},
    {text:name,options:{fontSize:15,bold:true,color:INK,breakLine:true}},
    {text:code,options:{fontSize:12,bold:true,color:roleC,breakLine:true}},
    {text:plant,options:{fontSize:10,color:MUTED}},
  ],{x:x+0.18,y:y+0.12,w:w-0.3,h:1.1,fontFace:F,valign:"top",margin:0,paraSpaceAfter:3,isTextBox:true,objectName:obj+" 文字"});
};
card(T.x+0.35,T.y-0.75,3.3,"買方/收貨","C0392B","立訊精密（義安）有限公司","Company 3110","Plant 2610｜立訊精密(義安)BU26-保稅","中國・安徽 銅陵市 義安區","義安");
card(HK.x-3.05,HK.y-0.1,2.8,"中間轉單",BLUE,"香港立訊","Company A2100","商流轉單（不經手實體貨物）","中國・香港","香港");
card(KH.x+0.38,KH.y-0.45,3.2,"賣方/出貨","C0392B","宣德智能股份有限公司","Company 2207","Plant 2662 / TW07｜宣德智能BU26-非保稅","台灣・高雄","高雄");

s.addNotes("商流：義安(3110)下 PO 給香港立訊(A2100)，香港立訊再下 PO 給高雄宣德智能(2207)。物流：宣德智能高雄直接出貨至義安(2610)。");
pres.writeFile({fileName:"商流物流示意圖.pptx"}).then(()=>console.log("done"));
