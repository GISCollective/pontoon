/* Must be available immediately */
// Add case insensitive :contains-like selector to jQuery (search & filter)
$.expr[':'].containsi = function (a, i, m) {
  return (
    (a.textContent || a.innerText || '')
      .toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0
  );
};

/* Latest activity tooltip */
const delay = 500,
  date_formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
  time_formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
let timer = null;

$('body')
  .on('mouseenter', '.latest-activity .latest time', function () {
    const $element = $(this);

    timer = setTimeout(function () {
      const translation = Pontoon.doNotRender($element.data('translation')),
        avatar = $element.data('user-avatar'),
        action = $element.data('action'),
        name = $element.data('user-name'),
        link = $element.data('user-link'),
        date = date_formatter.format(new Date($element.attr('datetime'))),
        time = time_formatter.format(new Date($element.attr('datetime')));

      $element.after(
        '<aside class="tooltip">' +
          '<span class="quote fas fa-quote-right fa-2x"></span>' +
          '<p class="translation">' +
          translation +
          '</p>' +
          '<footer class="clearfix">' +
          '<div class="wrapper">' +
          '<div class="translation-details">' +
          '<p class="translation-action">' +
          action +
          ' <a href="' +
          link +
          '">' +
          name +
          '</a></p>' +
          '<p class="translation-time">on ' +
          date +
          ' at ' +
          time +
          '</p>' +
          '</div>' +
          (avatar
            ? '<img class="rounded" height="44" width="44" src="' +
              avatar +
              '">'
            : '') +
          '</div>' +
          '</footer>' +
          '</aside>',
      );
    }, delay);
  })
  .on('mouseleave', 'td.latest-activity', function () {
    $('.latest-activity .latest .tooltip').remove();
    clearTimeout(timer);
  });

/* Public functions used across different files */
// eslint-disable-next-line no-var
var Pontoon = (function (my) {
  return $.extend(true, my, {
    table: {
      /*
       * Filter table
       *
       * TODO: remove old search code from main.js
       */
      filter: (function () {
        $('body').on('input.filter', 'input.table-filter', function (e) {
          if (e.which === 9) {
            return;
          }

          // Filter input field
          const field = $(this),
            // Selector of the element containing a list of items to filter
            list = $(this).data('list') || '.table-sort tbody',
            // Selector of the list item element, relative to list
            item = $(this).data('item') || 'tr',
            // Selector of the list item element's child to match filter query against
            filter = $(this).data('filter') || 'td:first-child';

          $(list)
            .find(item + '.limited')
            .hide()
            .end()
            .find(
              item +
                '.limited ' +
                filter +
                ':containsi("' +
                $(field).val() +
                '")',
            )
            .parents(item)
            .show();
        });
      })(),

      /*
       * Sort table
       */
      sort: (function () {
        $('body').on('click', 'table.table-sort th', function () {
          function getProgress(el) {
            const legend = $(el).find('.progress .legend'),
              all = legend.find('.all .value').data('value') || 0,
              translated =
                legend.find('.translated .value').data('value') / all || 0,
              pretranslated =
                legend.find('.pretranslated .value').data('value') / all || 0,
              warnings =
                legend.find('.warnings .value').data('value') / all || 0;

            if ($(el).find('.progress .not-ready').length) {
              return 'not-ready';
            }

            return translated + pretranslated + warnings;
          }

          function getUnreviewed(el) {
            return parseInt(
              $(el)
                .find('.progress .legend .unreviewed .value')
                .data('value') || 0,
            );
          }

          function getTime(el) {
            const date =
              $(el)
                .find('td:eq(' + index + ')')
                .find('time')
                .attr('datetime') || 0;
            return new Date(date).getTime();
          }

          function getPriority(el) {
            return $(el).find('.priority .fa-star.active').length;
          }

          function getEnabled(el) {
            return $(el).find('.check.enabled').length;
          }

          function getNumber(el) {
            return parseInt($(el).find('span').text().replace(/,/g, ''));
          }

          function getSort(el) {
            return parseInt($(el).find('[data-sort]').data('sort'), 10) || 0;
          }

          function getString(el) {
            return $(el)
              .find('td:eq(' + index + ')')
              .text();
          }

          const node = $(this),
            index = node.index(),
            table = node.parents('.table-sort'),
            list = table.find('tbody'),
            items = list.find('tr'),
            dir = node.hasClass('asc') ? -1 : 1,
            cls = node.hasClass('asc') ? 'desc' : 'asc';

          // Default value for rows which don't have a timestamp
          let defaultTime;
          if (node.is('.deadline')) {
            defaultTime = new Date(0).getTime();
          }

          $(table).find('th').removeClass('asc desc');
          node.addClass(cls);

          items.sort(function (a, b) {
            // Sort by completion
            if (node.is('.progress')) {
              const chartA = getProgress(a),
                chartB = getProgress(b);

              if (chartA === 'not-ready') {
                if (chartB === 'not-ready') {
                  return 0;
                } else {
                  return -1 * dir;
                }
              }
              if (chartB === 'not-ready') {
                return 1 * dir;
              }

              return (chartA - chartB) * dir;

              // Sort by unreviewed state
            } else if (node.is('.unreviewed-status')) {
              return (getUnreviewed(b) - getUnreviewed(a)) * dir;

              // Sort by deadline
            } else if (node.is('.deadline')) {
              const timeA = getTime(a),
                timeB = getTime(b);

              if (timeA === defaultTime && timeB === defaultTime) {
                return getString(a).localeCompare(getString(b)) * dir;
              } else if (timeA === defaultTime) {
                return 1 * dir;
              } else if (timeB === defaultTime) {
                return -1 * dir;
              }
              return (timeA - timeB) * dir;

              // Sort by relative time
            } else if (
              node.is('.latest-activity') ||
              node.is('.relative-time')
            ) {
              return (getTime(b) - getTime(a)) * dir;

              // Sort by priority
            } else if (node.is('.priority')) {
              return (getPriority(b) - getPriority(a)) * dir;

              // Sort by enabled state
            } else if (node.is('.check')) {
              return (getEnabled(a) - getEnabled(b)) * dir;

              // Sort by number of speakers
            } else if (node.is('.population')) {
              return (getNumber(a) - getNumber(b)) * dir;

              // Sort by the data-sort attribute
            } else if (node.attr('data-sort') !== undefined) {
              return (getSort(a) - getSort(b)) * dir;

              // Sort by alphabetical order
            } else {
              return getString(a).localeCompare(getString(b)) * dir;
            }
          });

          list.append(items);
        });
      })(),
    },
  });
})(Pontoon || {});
