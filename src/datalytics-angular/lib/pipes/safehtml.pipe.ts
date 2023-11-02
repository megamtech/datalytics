import { DomSanitizer } from '@angular/platform-browser'
import { PipeTransform, Pipe, Inject } from "@angular/core";

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {

    sanitized: DomSanitizer;
    constructor(@Inject(DomSanitizer) sanitized: DomSanitizer) {
        this.sanitized = sanitized;
     }
    transform(value) {
        return this.sanitized.sanitize(0, value);
    }
}