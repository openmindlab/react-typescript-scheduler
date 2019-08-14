function getPos(element: any) {
    let x = 0;
    let y = 0;
    if (!!element) {
        do {
            x += element.offsetLeft - element.scrollLeft;
            y += element.offsetTop - element.scrollTop;
        // tslint:disable-next-line: no-conditional-assignment
        } while (element = element.offsetParent);
    }
    return { x, y };
}

export {
    getPos,
};
