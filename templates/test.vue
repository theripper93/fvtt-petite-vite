<span>{{l("levels3dpreview.mapgen.generator.title")}}</span>
<ol>
    <li v-for="item of store.items">
        {{item.name}}
        <input v-model="item.name" value="{{item.name}}"/>
    </li>
</ol>