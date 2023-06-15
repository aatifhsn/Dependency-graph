const {StatsWriterPlugin}=require("webpack-stats-plugin");

const StatsGeneratorPlugin=new StatsWriterPlugin({
    filename: "stats.json",
          stats: {
            all: false,
            assets: true,
            modules: true,
            reasons: true,
            ids: true,
            reasonsSpace: Infinity,
            moduleSpace: Infinity,
            depth: true,
          },
          transform(data) {
            var arr=[];

            data.modules.forEach((val)=>{
              if(val.type==="runtime modules")
              {
                var obj={
                  name: val.type,
                  size: val.size,
                };
                arr.push(obj);
              }
              else
              {
                var obj={
                  name: val.name,
                  size: val.size,
                  chunkName: val.chunks[0],
                  depth: val.depth,
                  errors: val.errors,
                  warnings: val.warnings,
                  issuerName:[
                    val.issuerName,
                  ],
                }
                var hashMap={};
                hashMap[val.name]=1;
                hashMap[val.issuerName]=1;
                val.reasons.forEach((reason)=>{
                  if(!hashMap[reason.moduleName])
                  {
                    hashMap[reason.moduleName]=1;
                    obj['issuerName'].push(reason.moduleName);
                  }
                });
                arr.push(obj);
              }
            });
            return JSON.stringify(
              {
                modules: arr,
              },
            );
          }
});

module.exports=StatsGeneratorPlugin;