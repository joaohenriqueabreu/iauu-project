// UI componentes
import Vue from 'vue';
import { Slide } from 'vue-carousel';
import VueTheMask from 'vue-the-mask';
import VueSmoothScroll from 'vue2-smooth-scroll';
import { FadeTransition, SlideYDownTransition } from 'vue2-transitions';
import VueModal from 'vue-js-modal';
import LinkPrevue from 'link-prevue';
import Chat from 'vue-beautiful-chat';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import moment from 'moment';

// Form components
import Logo from '@/components/layout/logo';
import Avatar from '@/components/layout/avatar';
import Modal from '@/components/layout/modal';
import AlertMessage from '@/components/layout/alert';
import Overlay from '@/components/layout/overlay';
import Carousel from '@/components/layout/carousel';
import Loading from '@/components/layout/loading';
import Notifications from '@/components/layout/notifications';
import MediaViewer from '@/components/media/viewer';
import MediaThumbnail from '@/components/media/thumbnail';
import MediaAvatar from '@/components/media/avatar';
import Rating from '@/components/artist/profile/rating';
import Feedback from '@/components/admin/feedback';
import Share from '@/components/layout/share';
import PriceRange from '@/components/artist/profile/priceRange';
import Tabs from '@/components/layout/tabs';
import Timeline from '@/components/layout/timeline';
import ProgressBar from '@/components/layout/progress';

import LineChart from '@/components/layout/charts/line';
import BarChart from '@/components/layout/charts/bar';
import StackedBarChart from '@/components/layout/charts/stackedBar';
import LineBarChart from '@/components/layout/charts/lineBar';
import StatsDonut from '@/components/layout/charts/statsDonut';
import GeoChart from '@/components/layout/charts/geo';

import FormInput from '@/components/form/input';
import FormNumeric from '@/components/form/numeric';
import FormPassword from '@/components/form/password';
import FormEmail from '@/components/form/email';
import FormMasked from '@/components/form/masked';
import FormMoney from '@/components/form/money';
import FormTime from '@/components/form/time';
import FormCheckbox from '@/components/form/checkbox';
import FormRange from '@/components/form/range';
import FormDate from '@/components/form/date';
import FormTextarea from '@/components/form/textarea';
import FormLocation from '@/components/form/location';
import FormSelect from '@/components/form/select';
import FormToggle from '@/components/form/toggle';
import FormValidation from '@/components/form/validation';

import Button from '@/components/form/button';
import ImageUploader from '@/components/form/imageUploader';
import FileUploader from '@/components/form/fileUploader';
import Attachment from '@/components/form/attachment';

moment.locale('pt-br');

Vue.use(Modal);
Vue.use(VueSmoothScroll);
Vue.use(VueModal, { componentName: 'v-modal' });
Vue.use(VueTheMask);
Vue.use(Chat);

Vue.component('logo', Logo);
Vue.component('avatar', Avatar);
Vue.component('overlay', Overlay);
Vue.component('loading', Loading);
Vue.component('notifications', Notifications);
Vue.component('carousel', Carousel);
Vue.component('slide', Slide);
Vue.component('scrollbar', VuePerfectScrollbar);
Vue.component('tabs', Tabs);
Vue.component('timeline', Timeline);
Vue.component('progress-bar', ProgressBar);

Vue.component('form-input', FormInput);
Vue.component('form-numeric', FormNumeric);
Vue.component('form-password', FormPassword);
Vue.component('form-textarea', FormTextarea);
Vue.component('form-email', FormEmail);
Vue.component('form-masked', FormMasked);
Vue.component('form-time', FormTime);
Vue.component('form-date', FormDate);
Vue.component('form-money', FormMoney);
Vue.component('form-location', FormLocation);
Vue.component('form-select', FormSelect);
Vue.component('form-checkbox', FormCheckbox);
Vue.component('form-toggle', FormToggle);
Vue.component('form-range', FormRange);
Vue.component('form-validation', FormValidation);
Vue.component('form-button', Button);

Vue.component('image-uploader', ImageUploader);
Vue.component('file-uploader', FileUploader);
Vue.component('fade-transition', FadeTransition);
Vue.component('slide-down-transition', SlideYDownTransition);
Vue.component('link-preview', LinkPrevue);
Vue.component('modal', Modal);
Vue.component('alert', AlertMessage);
Vue.component('media-viewer', MediaViewer);
Vue.component('media-thumbnail', MediaThumbnail);
Vue.component('media-avatar', MediaAvatar);
Vue.component('attachment', Attachment);
Vue.component('rating', Rating);
Vue.component('price-range', PriceRange);
Vue.component('feedback', Feedback);
Vue.component('share', Share);

Vue.component('stats-donut', StatsDonut);
Vue.component('line-chart', LineChart);
Vue.component('bar-chart', BarChart);
Vue.component('stacked-bar-chart', BarChart);
Vue.component('line-and-bar-chart', LineBarChart);
Vue.component('geo-chart', GeoChart);

Vue.prototype.moment = moment;
Vue.prototype.delay = setTimeout(() => {}, 500);
