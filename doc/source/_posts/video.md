---
title: video(��Ƶģ��)
date: 2017-06-09 11:00:00
tags:
---
���ߣ�`kevinhehe`
�汾��`v.1`
������`mocha.css`
<div class="demo-qrcode"><a id="QRcode" href="http://tgideas.github.io/mocha/demo/video/demo.html" target="_blank">�������Demo</a></div>
### ��ʽ1 `.mocha-video-scheme1`
<div class="demo-preview"><div class="box-w320"><img src="http://ossweb-img.qq.com/images/js/mocha/images/demo/video.png" alt="��ʽ1"></div>
``` html
<div id="mochaVideo" class="mocha-video mocha-video-scheme1 mocha-video-skin1"></div>
```
</div>
### videoʵ����JS
����`tvp.player_v2.js`���
``` html
<script src='//vm.gtimg.cn/tencentvideo/txp/js/txplayer.js'></script>
<script type="text/javascript">
var player = new Txplayer({
  containerId: 'mochaVideo',
  vid: 'r0018hmh1pa',
  width: '100%',
  height: '100%',
  // �Զ�����
  autoplay: true
});
</script>
```

### �޸�ģ��Ƥ��CSS 
ģ���Ĭ��Ƥ����`.mocha-video-skin1`��������������Ŀ��`page.css`���޸�`.mocha-video-skin1`Ƥ���࣬��������`.mocha-video-skin2`��