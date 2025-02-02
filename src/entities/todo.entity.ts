import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
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
    default: false 
  })
  isCompleted;

  @Column({ type: "datetime", nullable: true })
  dueDate;

  @ManyToOne(() => UserEntity, (user:UserEntity) => user.todos)
  user: UserEntity;
}
