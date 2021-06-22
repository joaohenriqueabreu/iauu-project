import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/bootstrap/main.css';

import Vue              from 'vue';
import brBLocale        from '@fullcalendar/core/locales/pt-br';
import Calendar         from '@/components/events/calendar';
import PublicCalendar   from '@/components/events/publicCalendar';

Vue.component('calendar',         Calendar,       { locale: brBLocale });
Vue.component('public-calendar',  PublicCalendar, { locale: brBLocale });
