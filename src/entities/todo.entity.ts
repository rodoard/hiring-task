import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { CoreEntity } from "./core.entity";
import { UserEntity } from "./user.entity";

@Entity("todo")
export class TodoEntity extends CoreEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid;

  @Column({ type: "varchar", nullable: false })
  title;

  @Column({ type: "text", nullable: true })
  description;

  @Column({ 
    type: "boolean", 
    default: false,
    name: "is_completed"
  })
  isCompleted;

  @Column({ 
    type: "datetime", 
    nullable: true,
    name: "due_date"
  })
  dueDate;

  @ManyToOne(() => UserEntity, (user:UserEntity) => user.todos)
  @JoinColumn({ name: 'user_uuid' }) // Explicitly define snake_case foreign key column
  user: UserEntity;
}
