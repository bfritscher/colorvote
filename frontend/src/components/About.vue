<template>
  <div>
    <logo></logo>
    <div id="container">
      <div class="inner">
        <section id="main_content">
          <h2>Votation anonyme, rapide et multiplatforme</h2>
          <p>&nbsp;</p>
          <h3>Présentation</h3>
          <p class="center">
            <iframe
              src="http://www.slideshare.net/slideshow/embed_code/28555735"
              width="595"
              height="485"
              frameborder="0"
              marginwidth="0"
              marginheight="0"
              scrolling="no"
              style="
                border: 1px solid #ccc;
                border-width: 1px 1px 0;
                margin-bottom: 5px;
              "
              allowfullscreen
            >
            </iframe>
          </p>
          <p>
            Téléchargez le guide:
            <a href="/downloads/ColorvoteGuide.pdf">ColorvoteGuide.pdf</a>
          </p>

          <p class="center">
            <iframe
              width="620"
              height="349"
              src="//www.youtube.com/embed/3us5FfN0BiE?rel=0"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </p>

          <h3>Poster</h3>
          <p class="center">
            <a href="/images/colorvote_poster.png"
              ><img src="/images/colorvote_poster_thumb.png" alt="poster"
            /></a>
          </p>

          <h3>Contact</h3>
          <p>
            contact <a href="mailto:boris@colorvote.ch">boris@colorvote.ch</a>
          </p>

          <h3>Technique</h3>
          <p>ColorVote utilise: Vue.js, node, socket.io</p>
          <p>
            <a
              href="https://github.com/bfritscher/colorvote"
              id="view-on-github"
              class="button"
              ><span>View on GitHub</span></a
            >
          </p>
        </section>

        <footer>
          Colorvote is maintained by
          <a href="https://github.com/bfritscher">Boris Fritscher</a><br />
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from "./Logo.vue";

export default {
  name: "About",
  components: {
    Logo,
  },
};
</script>

<style scoped>
body {
  background-color: #78c5d6;
  font: 16px/26px Roboto, "Helvetica Neue", Helvetica, Arial, serif;
}

a {
  color: #d5000d;
}
a:hover {
  color: #c5000c;
}

header {
  padding-top: 35px;
  padding-bottom: 25px;
}

header h1 {
  font-family: "Chivo", "Helvetica Neue", Helvetica, Arial, serif;
  font-weight: 900;
  letter-spacing: -1px;
  font-size: 48px;
  color: #303030;
  line-height: 1.2;
}

header h2 {
  letter-spacing: -1px;
  font-size: 24px;
  color: #aaa;
  font-weight: normal;
  line-height: 1.3;
}

#container {
  min-height: 595px;
}

.inner {
  width: 620px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
}

#container .inner img {
  max-width: 100%;
}

#downloads {
  margin-bottom: 40px;
}

a.button {
  -moz-border-radius: 30px;
  -webkit-border-radius: 30px;
  border-radius: 30px;
  border-top: solid 1px #cbcbcb;
  border-left: solid 1px #b7b7b7;
  border-right: solid 1px #b7b7b7;
  border-bottom: solid 1px #b3b3b3;
  color: #303030;
  line-height: 25px;
  font-weight: bold;
  font-size: 15px;
  padding: 12px 8px 12px 8px;
  display: block;
  width: 179px;
  margin-right: 14px;
  background: #fdfdfd; /* Old browsers */
  background: -moz-linear-gradient(top, #fdfdfd 0%, #f2f2f2 100%); /* FF3.6+ */
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #fdfdfd),
    color-stop(100%, #f2f2f2)
  ); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(
    top,
    #fdfdfd 0%,
    #f2f2f2 100%
  ); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(
    top,
    #fdfdfd 0%,
    #f2f2f2 100%
  ); /* Opera 11.10+ */
  background: -ms-linear-gradient(top, #fdfdfd 0%, #f2f2f2 100%); /* IE10+ */
  background: linear-gradient(top, #fdfdfd 0%, #f2f2f2 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fdfdfd', endColorstr='#f2f2f2',GradientType=0 ); /* IE6-9 */
  -webkit-box-shadow: 10px 10px 5px #888;
  -moz-box-shadow: 10px 10px 5px #888;
  box-shadow: 0px 1px 5px #e8e8e8;
}
a.button:hover {
  border-top: solid 1px #b7b7b7;
  border-left: solid 1px #b3b3b3;
  border-right: solid 1px #b3b3b3;
  border-bottom: solid 1px #b3b3b3;
  background: #fafafa; /* Old browsers */
  background: -moz-linear-gradient(top, #fdfdfd 0%, #f6f6f6 100%); /* FF3.6+ */
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #fdfdfd),
    color-stop(100%, #f6f6f6)
  ); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(
    top,
    #fdfdfd 0%,
    #f6f6f6 100%
  ); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(
    top,
    #fdfdfd 0%,
    #f6f6f6 100%
  ); /* Opera 11.10+ */
  background: -ms-linear-gradient(top, #fdfdfd 0%, #f6f6f6 100%); /* IE10+ */
  background: linear-gradient(top, #fdfdfd 0%, #f6f6f6, 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fdfdfd', endColorstr='#f6f6f6',GradientType=0 ); /* IE6-9 */
}

a.button span {
  padding-left: 50px;
  display: block;
  height: 23px;
}

#download-zip span {
  background: transparent url(../images/zip-icon.png) 12px 50% no-repeat;
}
#download-tar-gz span {
  background: transparent url(../images/tar-gz-icon.png) 12px 50% no-repeat;
}
#view-on-github span {
  background: transparent url(../images/octocat-icon.png) 12px 50% no-repeat;
}
#view-on-github {
  margin-right: 0;
}

code,
pre {
  font-family: Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal;
  color: #222;
  margin-bottom: 30px;
  font-size: 14px;
}

code {
  background-color: #f2f2f2;
  border: solid 1px #ddd;
  padding: 0 3px;
}

pre {
  padding: 20px;
  background: #303030;
  color: #f2f2f2;
  text-shadow: none;
  overflow: auto;
}
pre code {
  color: #f2f2f2;
  background-color: #303030;
  border: none;
  padding: 0;
}

ul,
ol,
dl {
  margin-bottom: 20px;
}

/* COMMON STYLES */

hr {
  height: 1px;
  line-height: 1px;
  margin-top: 1em;
  padding-bottom: 1em;
  border: none;
  background: transparent url("../images/hr.png") 50% 0 no-repeat;
}

strong {
  font-weight: bold;
}

em {
  font-style: italic;
}

table {
  width: 100%;
  border: 1px solid #ebebeb;
}

th {
  font-weight: 500;
}

td {
  border: 1px solid #ebebeb;
  text-align: center;
  font-weight: 300;
}

form {
  background: #f2f2f2;
  padding: 20px;
}

/* GENERAL ELEMENT TYPE STYLES */

h1 {
  font-size: 32px;
}

h2 {
  font-size: 22px;
  font-weight: bold;
  color: #303030;
  margin-bottom: 8px;
}

h3 {
  color: #d5000d;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

h4 {
  font-size: 16px;
  color: #303030;
  font-weight: bold;
}

h5 {
  font-size: 1em;
  color: #303030;
}

h6 {
  font-size: 0.8em;
  color: #303030;
}

p {
  font-weight: 300;
  margin-bottom: 20px;
}

a {
  text-decoration: none;
}

p a {
  font-weight: 400;
}

blockquote {
  font-size: 1.6em;
  border-left: 10px solid #e9e9e9;
  margin-bottom: 20px;
  padding: 0 0 0 30px;
}

ul li {
  list-style: disc inside;
  padding-left: 20px;
}

ol li {
  list-style: decimal inside;
  padding-left: 3px;
}

dl dt {
  color: #303030;
}

footer {
  background: transparent url("../images/hr.png") 0 0 no-repeat;
  margin-top: 40px;
  padding-top: 20px;
  padding-bottom: 30px;
  font-size: 13px;
  color: #aaa;
}

footer a {
  color: #666;
}
footer a:hover {
  color: #444;
}

/* MISC */
.clearfix:after {
  clear: both;
  content: ".";
  display: block;
  visibility: hidden;
  height: 0;
}

.clearfix {
  display: inline-block;
}
* html .clearfix {
  height: 1%;
}
.clearfix {
  display: block;
}
/* All Mobile Sizes (devices and browser) */
@media only screen and (max-width: 767px) {
  header {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  #downloads {
    margin-bottom: 25px;
  }
  #download-zip,
  #download-tar-gz {
    display: none;
  }
  .inner {
    width: 94%;
    margin: 0 auto;
  }
}
</style>
