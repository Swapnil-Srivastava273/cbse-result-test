const cbse="http://cbseresults.nic.in/cbseresults_cms/Public/Home.aspx";
const http=require("http");
let count=0;
let changed=false;
let changedDate=null;
let interval=null;
let check=()=>{
    http.get({'host':'cbseresults.nic.in','path':'/cbseresults_cms/Public/Home.aspx','headers':{'user-agent':'/cbseresults_cms/Public/Home.aspx','pragma':'no-cache','cache-control':'no-cache','referer':'https://www.google.com/'}},resp=>{
        let data="";
        resp.on('data',chunk=>{
            data+=chunk;
        });
        resp.on('end',()=>{
            if(resp.statusCode===200){
                if(!data.includes("(Last Update :02/05/2019)")&&data.length>300){
                    console.log("Something has changed !!!");
                    console.log(data+'\n\n');
                    changed=true;
                    changedDate=new Date();
                    if(interval)clearInterval(interval);
                }else if(!(data.length>300)){
                    check();
                    console.log("Some stupid redirect ?");
                    console.log(data);
                    console.log(resp.headers);
                }else{
                    console.log("still no change :c");
                }
            }else{
                console.log(resp.headers);
                console.log(data);
                console.log(resp.statusCode);
                //check();
            }    

            console.log(`Tried for ${++count} th time at ${(new Date()).toString()}`);
        });
    });
};
check();
interval=setInterval(check,1000*60*1)//check every 1 mins


http.createServer((req,res)=>{
    res.writeHead(200,{"content-type":"text/plain"});
    res.end(`${count} ${changed} ${changed?changedDate:''}`);
}).listen(process.env.PORT||5000);

