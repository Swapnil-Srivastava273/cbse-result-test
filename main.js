const cbse="http://cbseresults.nic.in/cbseresults_cms/Public/Home.aspx";
const http=require("http");
const vm=require("vm");
let count=0;
let changed=false;
let changedDate=null;
let interval=null;
let check=(path='/cbseresults_cms/Public/Home.aspx')=>{
    http.get({'host':'cbseresults.nic.in','path':path,'headers':{'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36','pragma':'no-cache','cache-control':'no-cache','referer':'https://www.google.com/',"cookie":"ASP.NET_SessionId=vegxnc0xxcu54z4rvotbabay"}},resp=>{
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
                    //check();
                    console.log("Some stupid redirect ?");
                    console.log(data);
                    console.log(resp.headers);
                    let sandbox={
                        y:{
                            location:{
                                assign:function(x){this.loc=x;}
                            },
                            loc:""
                        }
                    };
                    vm.createContext(sandbox);
                    let code=data.match(/<\/script><script>[^<]*<\/script><\/html>/)[0].slice(17,-16);
                    vm.runInContext("y.location.assign=function(x){y.loc=x;};"+code,sandbox);
                    //console.log(sandbox.y.loc);
                    check(sandbox.y.loc);
                    }else{
                    console.log("still no change :c");
                }
            }else{
                console.log(resp.headers);
                console.log(data);
                console.log(resp.statusCode);
                if(resp.statusCode===302)check(resp.headers.location);
                //check();
            }    
            console.log(path);
            console.log(`Tried for ${++count} th time at ${(new Date()).toString()}`);
        });
    });
};
check();
interval=setInterval(check,1000*60*60)//check every 60 mins


http.createServer((req,res)=>{
    res.writeHead(200,{"content-type":"text/plain"});
    res.end(`${count} ${changed} ${changed?changedDate:''}`);
}).listen(process.env.PORT||5000);
