!function(e){function t(){}function n(e){i=[e]}function c(e,t,n){return e&&e.apply&&e.apply(t.context||t,n)}function r(e){return/\?/.test(e)?"&":"?"}function o(o){function m(e){V++||(W(),K&&(I[M]={s:[e]}),A&&(e=A.apply(o,[e])),c(R,o,[e,k,o]),c(z,o,[o,k]))}function S(e){V++||(W(),K&&e!=x&&(I[M]=e),c(U,o,[o,e]),c(z,o,[o,e]))}o=e.extend({},B,o);var $,_,q,P,Q,R=o.success,U=o.error,z=o.complete,A=o.dataFilter,G=o.callbackParameter,H=o.callback,J=o.cache,K=o.pageCache,L=o.charset,M=o.url,N=o.data,O=o.timeout,V=0,W=t;return w&&w(function(e){e.done(R).fail(U),R=e.resolve,U=e.reject}).promise(o),o.abort=function(){!V++&&W()},c(o.beforeSend,o,[o])===!1||V?o:(M=M||l,N=N?"string"==typeof N?N:e.param(N,o.traditional):l,M+=N?r(M)+N:l,G&&(M+=r(M)+encodeURIComponent(G)+"=?"),!J&&!K&&(M+=r(M)+"_"+(new Date).getTime()+"="),M=M.replace(/=\?(&|$)/,"="+H+"$1"),K&&($=I[M])?$.s?m($.s[0]):S($):(C[H]=n,q=e(j)[0],q.id=f+T++,L&&(q[u]=L),D&&D.version()<11.6?(P=e(j)[0]).text="document.getElementById('"+q.id+"')."+h+"()":q[a]=a,F&&(q.htmlFor=q.id,q.event=p),q[y]=q[h]=q[v]=function(e){if(!q[g]||!/i/.test(q[g])){try{q[p]&&q[p]()}catch(t){}e=i,i=0,e?m(e[0]):S(s)}},q.src=M,W=function(){Q&&clearTimeout(Q),q[v]=q[y]=q[h]=null,E[b](q),P&&E[b](P)},E[d](q,_=E.firstChild),P&&E[d](P,_),Q=O>0&&setTimeout(function(){S(x)},O)),o)}var i,a="async",u="charset",l="",s="error",d="insertBefore",f="_jqjsp",m="on",p=m+"click",h=m+s,y=m+"load",v=m+"readystatechange",g="readyState",b="removeChild",j="<script>",k="success",x="timeout",C=window,w=e.Deferred,E=e("head")[0]||document.documentElement,I={},T=0,B={callback:f,url:location.href},D=C.opera,F=!!e("<div>").html("<!--[if IE]><i><![endif]-->").find("i").length;o.setup=function(t){e.extend(B,t)},e.jsonp=o}(jQuery);