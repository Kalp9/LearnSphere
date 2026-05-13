import { ArrowRight, PlayCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/format";
import { mediaUrl } from "../utils/media";

const CourseCard = ({ course, owned = false }) => (
  <article className="glass group overflow-hidden rounded-lg transition duration-200 hover:-translate-y-1 hover:border-cyan-300/40">
    <div className="relative h-48 overflow-hidden bg-slate-900">
      <img
        src={course.thumbnailUrl || mediaUrl(course.thumbnail)}
        alt={course.title}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <span className="absolute left-4 top-4 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-bold text-cyan-200 backdrop-blur">
        {course.category}
      </span>
    </div>
    <div className="flex min-h-[240px] flex-col p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="line-clamp-2 text-xl font-bold text-white">{course.title}</h3>
        <span className="shrink-0 rounded-lg bg-cyan-300/12 px-3 py-1 text-sm font-extrabold text-cyan-200">
          {formatCurrency(course.price)}
        </span>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{course.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <span>{course.instructor}</span>
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {course.students?.length || 0}
        </span>
      </div>
      <div className="mt-auto pt-5">
        <Link to={`/courses/${course._id}`} className={owned ? "btn-secondary w-full" : "btn-primary w-full"}>
          {owned ? <PlayCircle className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          {owned ? "Continue learning" : "View course"}
        </Link>
      </div>
    </div>
  </article>
);

export default CourseCard;
