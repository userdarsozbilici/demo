import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  standalone: true,
  selector: '[appPhoneFormatter]',
})
export class PhoneFormatterDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = this.el.nativeElement
    let value = input.value.replace(/\D/g, '')

    if (value.length > 10) {
      value = value.slice(0, 10)
    }

    if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d+)$/, '($1) $2-$3')
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d+)$/, '($1) $2')
    } else if (value.length > 0) {
      value = value.replace(/^(\d+)$/, '($1')
    }

    input.value = value
  }
}
