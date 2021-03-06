import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'class-autobind'

class Chat extends React.Component {

	constructor() {
		super(...arguments)
		autobind(this)
		this.state = {currentText: ``}
	}

	onType(e) {
		const {chat} = this.props.actions
		const {currentText: prevText} = this.state
		const currentText = e.target.value

		if (!currentText.length) chat.stopTyping()
		if (currentText.length === 1 && !prevText.length) chat.startTyping()

		this.setState({currentText})
	}

	onSend(e) {
		if (e.type === `keyup` && e.key !== `Enter`) return

		const {chat} = this.props.actions
		const {currentText} = this.state
		if (!currentText.length) return

		chat.send(currentText)
		this.setState({currentText: ``})
	}

	getTypingMessage() {
		const {typing} = this.props.chat

		switch (typing.length) {
			case 0: return null
			case 1: return `${typing[0].name} is typing...`
			case 2: return `${typing[0].name} and ${typing[1].name} are typing...`
			case 3: return `${typing[0].name}, ${typing[1].name}, and ${typing[2].name} are typing...`
			// len > 3
			default: return `${typing.length} members are typing...`
		}
	}

	render() {
		const {classroom, chat, actions} = this.props
		const {colors} = this.state;
		const {bgColor, textColor, wallColor} = colors
		const borderColor = Color(textColor).lighten(0.42);
		const randomGraphic = "https://picsum.photos/300/200/?image=";
		const randomLink = "http://www.uroulette.com/visit/wvvvv";

		return <main style={{backgroundColor: bgColor, color: textColor}}>
			<Header title="Chatroom" borderColor={borderColor} colors={colors} onChange={this.updateColors}  />
 			<aside id="memberlist" style={{borderColor: borderColor}}>
					<h2>Members</h2>
					<List>
						{classroom.students.map((student, index) =>
							<Member id={student.id} key={student.id} name={student.name}></Member>
						)}
					</List>
					</aside>

			<section id="messages" style={{backgroundColor: wallColor, borderColor: borderColor}}>
					<h2>Messages</h2>
					<List>
						{chat.messages.map(({id, student, text, createdAt, textColor}) =>
							<Message id={id} text={text} key={id} createdAt={createdAt} textColor={textColor} member={student} visibility={"visible"}></Message>
						)}
					</List>
			</section>
			<section id="typing" style={{borderColor: borderColor}}>
			  <Composer chat={chat} actions={this.props.actions} borderColor={borderColor} textColor={textColor} backgroundColor={bgColor} members={classroom}/>
			</section>
			<footer style={{borderColor: borderColor}}>
			  <h3>Sponsored by our partners:</h3>
			  <Ad graphic={randomGraphic + Math.floor(Math.random() * 20) } buttonLink={randomLink} borderColor={borderColor} textColor={textColor}/>
			  <Ad graphic={randomGraphic + Math.floor(Math.random() * 20) } buttonLink={randomLink} borderColor={borderColor} textColor={textColor}/>
			</footer>
		</main>
	}

}

const studentPropType = PropTypes.shape({
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
})

Chat.propTypes = {
	classroom: PropTypes.shape({
		self: studentPropType,
		students: PropTypes.arrayOf(studentPropType).isRequired,
	}).isRequired,
	chat: PropTypes.shape({
		typing: PropTypes.arrayOf(studentPropType).isRequired,
		messages: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.number.isRequired,
			text: PropTypes.string.isRequired,
			student: studentPropType,
			createdAt: PropTypes.instanceOf(Date).isRequired,
		})).isRequired,
		send: PropTypes.shape({
			status: PropTypes.oneOf([`init`, `pending`, `success`, `failure`]).isRequired,
			message: PropTypes.string.isRequired,
		}).isRequired
	}),
	actions: PropTypes.object.isRequired,
}

export default Chat
