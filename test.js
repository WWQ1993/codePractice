var app = new Vue({
    el: '#app',
    template: `
<div>
<button v-on:click="add">add</button>
<button v-on:click="sub">sub</button>
<span>times, {{times}} computed: {{cTimes}}</span>
</div>
`,
    data: {
        times: 0
    },
    computed: {
        cTimes() {
            return this.times * (-1);
        }
    },
    methods: {
        add() {
            this.times ++;
        },
        sub() {
            this.times --;
        }
    },
    created() {
    }
});

console.log(app);
