class Page {
	constructor(url, image, name) {
		this.url = url
		this.image = image
		this.name = name
	}

	html() {
		let a = document.createElement('a')
		let figure = document.createElement('figure')
		let img = document.createElement('img')
		let caption = document.createElement('figcaption')

		a.setAttribute('href', this.url)
		img.setAttribute('src', this.image)
		img.setAttribute('alt', `Icon for ${this.name}`)
		caption.textContent = this.name

		figure.appendChild(img)
		figure.appendChild(caption)
		a.appendChild(figure)

		return a
	}
}

const DEFAULT_RULESET = {
	basis: {
		visible: true,
		open: false,
		priority: Infinity
	},
	times: []
}

class Collection {
	constructor(name, pages, rules = null) {
		this.name = name
		this.pages = pages
		this.rules = rules || DEFAULT_RULESET
	}

	getApplicableRule(time) {
		const matches = this.rules.times.filter(t =>
			(!('days' in t) || time.getDay() in t.days) &&
			(!('startHour' in t) || time.getHours() >= t.startHour) &&
			(!('endHour' in t) || time.getHours() <= t.endHour)
		)

		return matches[0] || this.rules.basis
	}

	isVisibleAt(time) {
		return this.getApplicableRule(time).visible
	}

	isOpenAt(time) {
		return this.getApplicableRule(time).open
	}

	html(time) {
		let details = document.createElement('details')
		let summary = document.createElement('summary')
		let container = document.createElement('div')

		summary.textContent = this.name

		container.classList.add('pages')
		this.pages.forEach(p => container.appendChild(p.html()))

		if (this.isOpenAt(time)) details.setAttribute('open', '')

		details.appendChild(summary)
		details.appendChild(container)

		return details
	}
}

(function() {

	const main = document.getElementsByTagName('main')[0]

	const pages = [
		new Page('#', 'https://picsum.photos/80?random=1', 'Page 1'),
		new Page('#', 'https://picsum.photos/80?random=2', 'Page 2'),
		new Page('#', 'https://picsum.photos/80?random=3', 'Page 3'),
		new Page('#', 'https://picsum.photos/80?random=4', 'Page 4'),
		new Page('#', 'https://picsum.photos/80?random=5', 'Page 5')
	]

	const col = new Collection('Pages', pages, rules = {
		basis: { visible: false, open: false },
		times: [
			{
				days: [0, 1, 2, 3, 4, 5, 6],
				startHour: 0,
				endHour: 14,
				visible: true,
				open: false,
				priority: 1
			}
		]
	})

	const cols = [
		new Collection('Pages', pages, rules = {
			basis: { visible: false, open: false },
			times: [
				{
					days: [0, 1, 2, 3, 4, 5, 6],
					startHour: 0,
					endHour: 142,
					visible: true,
					open: false,
					priority: 12
				}
			]
		}),
		new Collection('Pages 2', pages, rules = {
			basis: { visible: false, open: false },
			times: [
				{
					days: [0, 1, 2, 3, 4, 5, 6],
					startHour: 0,
					endHour: 124,
					visible: true,
					open: true,
					priority: 1
				}
			]
		})
	]

	const now = new Date()
	cols
		.filter(c => c.isVisibleAt(now))
		.sort((c1, c2) => c1.getApplicableRule(now).priority < c2.getApplicableRule(now).priority)
		.forEach(c => main.appendChild(c.html(now)))
})()
