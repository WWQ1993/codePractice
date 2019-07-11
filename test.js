var app = new Vue({
    el: '#app',
    template: `
<div>times, {{times}} computed: {{cTimes}}</div>
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
        addTimes() {

        }
    },
    created() {
        setInterval(() => {
            this.times ++;
        }, 1000);
    }
});

console.log(app);
