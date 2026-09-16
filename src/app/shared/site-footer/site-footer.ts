import { ChangeDetectionStrategy, Component } from '@angular/core';
import { profile } from '../../core/data/profile';
import { Icon } from '../../shared/icon/icon';

const FOOTER_LINK_IDS = ['home', 'about', 'experience', 'projects', 'learning', 'contact'];

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  protected readonly profile = profile;
  protected readonly year = new Date().getFullYear();
  protected readonly footerLinks = profile.navLinks.filter((link) =>
    FOOTER_LINK_IDS.includes(link.id),
  );
}