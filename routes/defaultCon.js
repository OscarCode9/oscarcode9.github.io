function contenido() {
  let con = `<div class="container">
  <div class="row">
  <div class="col s12 m12 l6">
      <i id="numLikes" class="fa fa-heart fa-2x" aria-hidden="true">{{#likeTotal}}{{/likeTotal}}</i>
  </div>
  <div class="col s12 m12 l6"><a id="fb_share_btn" class="waves-effect black btn">Compartir en <i class="fa fa-facebook-official" aria-hidden="true"></i></a></div>

  <div class="col s12 m12 l6">
      <div id="fb-root"></div>
  </div>
</div>
<div class="row">

  <div class="col s12 m12 l6">
      <h5>Hacer un comnetario...</h5>
      <div class="row">

          <div class="col s12 m12">

              <div class="card grey lighten-3">
                  <div class="card-content black-text">
                      <form id="dataComen">
                          <span class="card-title">
                              <input type="text" name="nombre">
                          </span>
                          <textarea id="textarea1" class="materialize-textarea" name="contenido"></textarea>
                      </form>
                  </div>
                  <div class="card-action">
                      <a id="comentar" class="waves-effect waves-light btn">Comentar</a>
                  </div>
              </div>
          </div>
      </div>
  </div>

</div>


</div>
<div class="comments-container">
<p id="numComenta" class="flow-text">{{numeroComentario}} comentarios.</p>
<input id="numComentarios" type="text" value="{{numeroComentario}}">
<ul id="comments-list" class="comments-list">

  {{#each comentarios}}

  <li>
      <div class="comment-main-level">
          <!-- Avatar -->
          <div class="comment-avatar">
              <img src={{urlPerfil}} alt="">
          </div>
          <!-- Contenedor del Comentario -->
          <div class="comment-box">
              <div class="comment-head">
                  <h6 class="comment-name ">
                      <a href="http://creaticode.com/blog">{{usuarioname}}</a>
                  </h6>
                  <span>{{fecha}}</span>

                  <i class="fa fa-heart">{{likes}}</i>
              </div>
              <div class="comment-content">
                  {{contenido}}
              </div>
          </div>
      </div>
      <!-- Respuestas de los comentarios -->

  </li>

  {{/each}}


</ul>
</div>
</div>

<script src="/postID.js"></script>`
  return con

}

module.exports = { contenido }