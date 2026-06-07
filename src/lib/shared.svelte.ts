let page = $state("");

let goto = (path: string) => (page = path);
let current = () => page;

export { goto, current };