import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[numberPositive]'
})
export class NumberPositiveDirective {
    // Allow decimal numbers and negative values
    private regex: RegExp = new RegExp(/^([0-9]*)$/gm);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = [ 'Enter', 'Backspace', 'Tab', 'End', 'Home', 'Delete',
        'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
    constructor(private el: ElementRef) {
    }
    @HostListener('keypress', [ '$event' ])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys}
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}