  <div class="page-content center-in-div">
    {{#each data.rows}}
    <ul class="list-float-none padding-for-div" style="display: block;">
      <li class="standart-button">
        {{#each this}}
          <p>{{@key}}: <span>{{this}}</span></p>
        {{/each}}
      </li>
    </ul>
    {{/each}}
  </div>
