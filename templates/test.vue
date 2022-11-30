<button @click="store.increment">Add to count (Current: {{store.count}})</button>

<ol>
    <li v-for="item of store.actor.items">
        {{item.name}}
        <input v-model="text" value="{{item.name}}"/>
    </li>
</ol>