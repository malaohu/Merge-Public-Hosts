const http = require('http');
const request = require('request');
const async = require('async');
const  cache = require('memory-cache');

const cache_key = 'RUYO';
const cache_timeout = 1000 * 60 * 10;
const hostname = '0.0.0.0';
const port = 3000;
const source = [
    'https://raw.githubusercontent.com/vokins/yhosts/master/hosts',
    'https://raw.githubusercontent.com/sy618/hosts/master/p',
    'https://raw.githubusercontent.com/sy618/hosts/master/y',
    'https://raw.githubusercontent.com/racaljk/hosts/master/hosts'
    ];
const server = http.createServer((req, res) => {
    build(source,function(err,data){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        let ccc = '#total : ' + data.length 
                + '\n'
                + '#create time : ' + new Date()
                + '\n'
                + '#how to use : http://51.ruyo.net/p/988.html'
                + '\n'
                + '########################### HOSTS ###########################'
                + '\n'
                + '#' + source.join('\n#')
                + '\n'
                + '\n';
        res.end(ccc + data.join('\n'));
    });
});

server.listen(port, hostname, () => {
    console.log(`服务器运行在 http://${hostname}:${port}/`);
    });


function requestit(url,callback)
{
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          callback(null,body);
        }
        else
            callback('none thing')
    })
}

function build(source,callback)
{
    let arr = cache.get(cache_key);
    if(arr && arr.length > 0){
        console.log('get data from cache');
        return callback(null,arr);
    }
    
    let result = {};
    async.eachSeries(source,function(url,cb){
        requestit(url,function(err,data){
            //剔除注释内容,空行
            data = data.replace(/#[^\n]+$/mg,'').replace(/\n[\s]+/mg,'').split('\n');
            console.log(data.length)
            for(let i = 0; i < data.length; i++)
            {
                _data = data[i].split(/\s+/);
                if(_data.length > 1){
                    //console.log(_data[1] + ' -> ' + _data[0])
                    result[_data[1]] = _data[0];
                }
            }
            cb();
        })   
    },function(err){
        //将JSON转成数组
        let arr = [];
        for(let o in result)
            arr.push(result[o] + '    ' + o);
        cache.put(cache_key, arr, cache_timeout); 
        console.log('get data from api');
        callback(err,arr);
    });
}

