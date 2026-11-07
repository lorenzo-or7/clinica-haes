import { asset, team, type Professional } from '../data/clinic';
import ProfileCard from './reactbits/ProfileCard';
import { Reveal } from './ui/Reveal';
import { ArrowUpRight, Instagram } from './ui/Icons';

/**
 * Equipe com o Profile Card original do React Bits (aprovado), configurado para a HAES:
 * inclinação máx. 5° por eixo, brilho dourado ~0,12, sem efeito holográfico, sem giroscópio,
 * sem animação de entrada. Nome, credenciais e descrição ficam fora do card, sempre legíveis.
 */
export function Team() {
  return (
    <section id="equipe" className="section team" aria-labelledby="team-title">
      <div className="container">
        <Reveal className="center-head" y={20}>
          <p className="eyebrow eyebrow--center">Equipe</p>
          <h2 id="team-title">Quem recebe você na HAES.</h2>
          <p>
            A HAES é conduzida por duas cirurgiãs-dentistas em Campo Grande: a Dra. Danielle Yahn, responsável
            técnica, e a Dra. Marianne Tavares, especialista em Dentística e co-proprietária.
          </p>
        </Reveal>
        <div className="team__grid">
          {team.map((person, i) => (
            <Reveal key={person.id} delay={0.15 + i * 0.14} y={40}>
              <TeamMember person={person} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamMember({ person }: { person: Professional }) {
  return (
    <article className="profile" aria-labelledby={`${person.id}-name`}>
      <ProfileCard
        className="profile-card--haes"
        avatarUrl={asset(person.portrait.src)}
        avatarAlt={person.portrait.alt}
        name=""
        title=""
        showUserInfo={false}
        radius={18}
        holo={0}
        glare={0.12}
        tiltStrength={5}
        parallax={4}
        enableMobileTilt={false}
        intro={false}
      />

      <div className="profile__info">
        <h3 id={`${person.id}-name`} className="profile__name">
          {person.name}
        </h3>
        <p className="profile__credential">{person.credential}</p>
        <ul className="profile__roles">
          {person.roles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
        <blockquote className="profile__quote">
          <p>“{person.quote}”</p>
        </blockquote>
        <a className="text-link profile__link" href={person.instagram} target="_blank" rel="noopener noreferrer">
          <Instagram />
          {person.instagramHandle}
          <span className="sr-only"> — Instagram de {person.name} (abre em nova aba)</span>
          <ArrowUpRight width={16} height={16} />
        </a>
      </div>
    </article>
  );
}
